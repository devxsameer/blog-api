import request from "supertest";
import { setupTestApp } from "../setup/test-app.js";
import { db } from "@/db/index.js";
import { usersTable } from "@/db/schema/users.js";
import { eq } from "drizzle-orm";

const app = setupTestApp();

let userCounter = 0;

export async function createUserAndLogin(
  role: "admin" | "author" | "user" = "user"
) {
  userCounter++;

  const email = `user_${userCounter}@test.com`;
  const username = `user_${userCounter}`;
  const password = "password123";

  const signupRes = await request(app).post("/api/auth/signup").send({
    username,
    email,
    password,
  });

  if (signupRes.status !== 201) {
    throw new Error(
      `Signup failed: ${signupRes.status} ${JSON.stringify(signupRes.body)}`
    );
  }

  const userId = signupRes.body.data.user.id;

  if (role !== "user") {
    await db.update(usersTable).set({ role }).where(eq(usersTable.id, userId));
  }

  const loginRes = await request(app).post("/api/auth/login").send({
    email,
    password,
  });

  if (loginRes.status !== 200) {
    throw new Error(
      `Login failed: ${loginRes.status} ${JSON.stringify(loginRes.body)}`
    );
  }

  return loginRes.body.data.accessToken as string;
}
