import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

const envPath = path.resolve(process.cwd(), ".env.test");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup/global-setup.ts"],
    fileParallelism: false,
  },
});
