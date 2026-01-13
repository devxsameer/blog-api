// src/db/schema/email-verification.ts

import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const emailVerificationTokensTable = pgTable(
  "email_verification_tokens",
  {
    id: uuid().primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    tokenHash: text("token_hash").notNull(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    usedAt: timestamp("used_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).defaultNow(),
  },
  (t) => [
    uniqueIndex("email_verification_token_hash_idx").on(t.tokenHash),
    index("email_verification_user_idx").on(t.userId),
    index("email_verification_expires_idx").on(t.expiresAt),
  ]
);
