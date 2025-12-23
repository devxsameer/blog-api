// src/db/schema/tags.ts
import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { postsTable } from "./posts.js";

export const tagsTable = pgTable("tags", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 50 }).notNull().unique(),
});

export const postTagsTable = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),

    tagId: uuid("tag_id")
      .notNull()
      .references(() => tagsTable.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("post_tags_unique_idx").on(table.postId, table.tagId)]
);
