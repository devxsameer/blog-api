import request from "supertest";
import { setupTestApp } from "#/setup/test-app.js";
import { createUserAndLogin } from "#/helpers/auth.js";
import { describe, expect, it } from "vitest";

const app = setupTestApp();

describe("Post API", () => {
  it("allows AUTHOR to create a post", async () => {
    const token = await createUserAndLogin("author");

    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Author Post",
        contentMarkdown: "This is valid markdown content",
        status: "published",
      });

    expect(res.status).toBe(201);
  });

  it("blocks USER from creating a post", async () => {
    const token = await createUserAndLogin("user");

    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "User Post",
        contentMarkdown: "This should fail",
      });

    expect(res.status).toBe(403);
  });

  it("allows ADMIN to create a post", async () => {
    const token = await createUserAndLogin("admin");

    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Admin Post",
        contentMarkdown: "Admin content",
        status: "published",
      });

    expect(res.status).toBe(201);
  });

  it("blocks unauthenticated post creation", async () => {
    const res = await request(app).post("/api/posts").send({
      title: "No Auth",
      contentMarkdown: "Fail",
    });

    expect(res.status).toBe(401);
  });

  it("lists public posts", async () => {
    const token = await createUserAndLogin("author");

    await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Public Post",
        contentMarkdown: "Content here",
        status: "published",
      });

    const res = await request(app).get("/api/posts");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});
