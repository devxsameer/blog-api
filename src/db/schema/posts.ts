// src/db/schema/posts.ts
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "archived",
]);

export const postsTable = pgTable(
  "posts",
  {
    id: uuid().primaryKey().defaultRandom(),

    authorId: uuid("author_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    title: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull().unique(),

    excerpt: text(),
    contentMarkdown: text("content_markdown").notNull(),
    contentHtml: text("content_html"),

    status: postStatusEnum().notNull().default("draft"),

    publishedAt: timestamp("published_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("posts_author_idx").on(table.authorId),
    index("posts_status_idx").on(table.status),
    index("posts_published_at_idx").on(table.publishedAt.desc()),
  ]
);
