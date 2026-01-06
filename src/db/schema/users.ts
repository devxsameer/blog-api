import {
  boolean,
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
    passwordHash: text("password_hash").notNull(),

    role: roleEnum().default("user").notNull(),
    isReadOnly: boolean("is_read_only").notNull().default(false),

    bio: text("bio"),
    avatarUrl: text("avatar_url"),

    emailVerifiedAt: timestamp("email_verified_at", {
      withTimezone: true,
    }),

    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).defaultNow(),
    deletedAt: timestamp("deleted_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    index("users_username_idx").on(table.username),
    index("users_role_idx").on(table.role),
  ]
);
