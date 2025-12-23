// src/db/schema/post-views.ts
import {
  index,
  inet,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { postsTable } from "./posts.js";

export const postViewsTable = pgTable(
  "post_views",
  {
    id: uuid().primaryKey().defaultRandom(),

    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),

    ipAddress: inet("ip_address"),
    userAgent: text("user_agent"),

    viewedAt: timestamp("viewed_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("post_views_post_idx").on(table.id),
    uniqueIndex("post_views_unique_idx").on(table.postId, table.ipAddress),
  ]
);
