// src/modules/tag/tag.repository.ts
import { db } from "@/db/index.js";
import { postTagsTable, tagsTable } from "@/db/schema/tags.js";
import { inArray, eq, desc, sql } from "drizzle-orm";

export async function insertTags(names: string[]) {
  if (!names.length) return [];

  return db
    .insert(tagsTable)
    .values(names.map((name) => ({ name })))
    .onConflictDoNothing()
    .returning();
}

export async function findTagsByNames(names: string[]) {
  if (!names.length) return [];

  return db.select().from(tagsTable).where(inArray(tagsTable.name, names));
}

export async function attachTagsToPost(postId: string, tagIds: string[]) {
  if (!tagIds.length) return;

  await db
    .insert(postTagsTable)
    .values(tagIds.map((tagId) => ({ postId, tagId })))
    .onConflictDoNothing();
}

export async function replacePostTags(postId: string, tagIds: string[]) {
  await db.transaction(async (tx) => {
    await tx.delete(postTagsTable).where(eq(postTagsTable.postId, postId));

    if (tagIds.length) {
      await tx
        .insert(postTagsTable)
        .values(tagIds.map((tagId) => ({ postId, tagId })));
    }
  });
}

export async function findTagsByPostId(postId: string) {
  return db
    .select({
      id: tagsTable.id,
      name: tagsTable.name,
    })
    .from(postTagsTable)
    .innerJoin(tagsTable, eq(postTagsTable.tagId, tagsTable.id))
    .where(eq(postTagsTable.postId, postId));
}

export async function findPopularTags(limit = 10) {
  return db
    .select({
      name: tagsTable.name,
      count: sql<number>`count(*)`,
    })
    .from(postTagsTable)
    .innerJoin(tagsTable, eq(postTagsTable.tagId, tagsTable.id))
    .groupBy(tagsTable.name)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}
