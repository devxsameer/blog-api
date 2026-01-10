// tests/setup/env-loader.ts
import dotenv from "dotenv";
import path from "path";

// Load .env.test specifically
dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

// Optional: Force NODE_ENV to test just in case
process.env.NODE_ENV = "test";
