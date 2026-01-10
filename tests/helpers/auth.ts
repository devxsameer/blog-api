import request from "supertest";
import { setupTestApp } from "../setup/test-app.js";

const app = setupTestApp();

export async function createUserAndLogin(role?: string) {
  const signup = await request(app).post("/api/auth/signup").send({
    username: "user",
    email: "user@test.com",
    password: "password123",
  });

  return signup.body.data.accessToken as string;
}
