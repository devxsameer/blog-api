import request from "supertest";
import { setupTestApp } from "#/setup/test-app.js";
import { createUserAndLogin } from "#/helpers/auth.js";
import { describe, expect, it } from "vitest";

const app = setupTestApp();

describe("Comment API", () => {
  it("creates a comment on a post", async () => {
    const token = await createUserAndLogin("author");

    const post = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Post with comments",
        contentMarkdown: "Hello this is markdown long for zod validation",
        status: "published",
      });

    const slug = post.body.data.slug;

    const res = await request(app)
      .post(`/api/posts/${slug}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Nice post!" });

    expect(res.status).toBe(201);
    expect(res.body.data.content).toBe("Nice post!");
  });

  it("rejects unauthenticated comments", async () => {
    const res = await request(app)
      .post("/api/posts/fake/comments")
      .send({ content: "Nope" });

    expect(res.status).toBe(401);
  });
});
