import { createUserAndLogin } from "#/helpers/auth.js";
import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "@/app.js";

describe("Post Likes", () => {
  it("likes and unlikes a post", async () => {
    const token = await createUserAndLogin("author");

    const post = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Likeable Post",
        contentMarkdown:
          "Yes this is markdown with more than 10 chars for zod validation",
        status: "published",
      });

    const slug = post.body.data.slug;

    const like = await request(app)
      .post(`/api/posts/${slug}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(like.status).toBe(201);

    const unlike = await request(app)
      .delete(`/api/posts/${slug}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(unlike.status).toBe(200);
  });
});
