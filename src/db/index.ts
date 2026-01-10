// src/db/index.ts
import { env } from "@/env.js";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { ExtractTablesWithRelations } from "drizzle-orm";
import pg from "pg";
import ws from "ws";

import * as commentsSchema from "./schema/comments.js";
import * as postLikesSchema from "./schema/post-likes.js";
import * as postViewsSchema from "./schema/post-views.js";
import * as postsSchema from "./schema/posts.js";
import * as tagsSchema from "./schema/tags.js";
import * as tokensSchema from "./schema/tokens.js";
import * as usersSchema from "./schema/users.js";

const schema = {
  ...commentsSchema,
  ...postLikesSchema,
  ...postViewsSchema,
  ...postsSchema,
  ...tagsSchema,
  ...tokensSchema,
  ...usersSchema,
};

type AppDB = PgDatabase<
  PgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

let db: AppDB;

if (env.NODE_ENV === "test") {
  const pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
  });

  db = drizzlePg(pool, { schema }) as unknown as AppDB;
} else {
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: env.DATABASE_URL });

  db = drizzleNeon(pool, { schema }) as unknown as AppDB;
}

export { db };
