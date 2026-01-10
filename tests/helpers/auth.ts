import request from "supertest";
import { setupTestApp } from "../setup/test-app.js";
import { db } from "@/db/index.js";
import { usersTable } from "@/db/schema/users.js";
import { eq } from "drizzle-orm";

const app = setupTestApp();

export async function createUserAndLogin(
  role: "admin" | "author" | "user" = "user"
) {
  const signupRes = await request(app)
    .post("/api/auth/signup")
    .send({
      username: `${role}_user`,
      email: `${role}@test.com`,
      password: "password123",
    });

  const userId = signupRes.body.data.user.id;

  if (role !== "user") {
    await db.update(usersTable).set({ role }).where(eq(usersTable.id, userId));
  }

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({
      email: `${role}@test.com`,
      password: "password123",
    });

  return loginRes.body.data.accessToken as string;
}
