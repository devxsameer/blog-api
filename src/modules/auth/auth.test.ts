import request from "supertest";
import { setupTestApp } from "#/setup/test-app.js";
import { describe, expect, it } from "vitest";

const app = setupTestApp();

describe("Auth API", () => {
  it("signs up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      username: "sameer",
      email: "sameer@test.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("sameer@test.com");
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("prevents duplicate signup", async () => {
    await request(app).post("/api/auth/signup").send({
      username: "sameer",
      email: "sameer@test.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/signup").send({
      username: "sameer2",
      email: "sameer@test.com",
      password: "password123",
    });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("EMAIL_ALREADY_EXISTS");
  });

  it("logs in existing user", async () => {
    await request(app).post("/api/auth/signup").send({
      username: "sameer",
      email: "sameer@test.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "sameer@test.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("rejects invalid login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "fake@test.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });
});
