import { db } from "@/db/index.js";
import { commentsTable } from "@/db/schema/comments.js";
import { postLikesTable } from "@/db/schema/post-likes.js";
import { postViewsTable } from "@/db/schema/post-views.js";
import { postsTable } from "@/db/schema/posts.js";
import { postTagsTable, tagsTable } from "@/db/schema/tags.js";
import { refreshTokensTable } from "@/db/schema/tokens.js";
import { usersTable } from "@/db/schema/users.js";

export async function resetDatabase() {
  await db.delete(postLikesTable);
  await db.delete(postViewsTable);
  await db.delete(commentsTable);
  await db.delete(postTagsTable);
  await db.delete(tagsTable);
  await db.delete(postsTable);
  await db.delete(refreshTokensTable);
  await db.delete(usersTable);
}
