import { db } from "@/db/index.js";
import { sql } from "drizzle-orm";

export async function resetDatabase() {
  await db.execute(sql`
    TRUNCATE TABLE
      post_likes,
      post_views,
      comments,
      post_tags,
      tags,
      posts,
      refresh_tokens,
      users
    RESTART IDENTITY CASCADE
  `);
}
