// src/db/schema/comments.ts
import {
  AnyPgColumn,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { postsTable } from "./posts.js";
import { usersTable } from "./users.js";

export const commentsTable = pgTable(
  "comments",
  {
    id: uuid().primaryKey().defaultRandom(),

    authorId: uuid("author_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),

    parentId: uuid("parent_id").references(
      (): AnyPgColumn => commentsTable.id,
      {
        onDelete: "cascade",
      }
    ),

    content: text().notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("comments_post_idx").on(table.postId),
    index("comments_parent_idx").on(table.parentId),
    index("comments_author_idx").on(table.authorId),
  ]
);
