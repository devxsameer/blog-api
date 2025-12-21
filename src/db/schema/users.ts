import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "author", "user"]);

export const usersTable = pgTable(
  "users",
  {
    id: uuid().primaryKey().defaultRandom(),
    username: varchar({ length: 32 }).notNull(),
    email: text().notNull().unique(),
    role: roleEnum().default("user").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    index("users_username_idx").on(table.username),
    index("users_role_idx").on(table.role),
  ]
);
