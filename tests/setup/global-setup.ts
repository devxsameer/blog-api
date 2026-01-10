import { beforeEach } from "vitest";
import { resetDatabase } from "./test-db.js";

beforeEach(async () => {
  await resetDatabase();
});
