// src/db/schema/post-views.ts
import {
  date,
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
    viewDate: date("view_date").notNull(),

    viewedAt: timestamp("viewed_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("post_views_post_idx").on(table.postId),
    uniqueIndex("post_views_unique_daily_idx").on(
      table.postId,
      table.ipAddress,
      table.viewDate
    ),
  ]
);
