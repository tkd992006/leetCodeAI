import { describe, it, expect, beforeEach } from "vitest";
import { createTestApp, resetStores, seedTestData } from "./helpers";

describe("Comments API", () => {
  const app = createTestApp();

  beforeEach(() => {
    resetStores();
  });

  describe("POST /tasks/:taskId/comments", () => {
    it("should create a comment on an existing task", async () => {
      const { alice, task } = seedTestData();

      const res = await app.request(`/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: alice.id,
          content: "This looks good!",
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.authorId).toBe(alice.id);
      expect(body.data.content).toBe("This looks good!");
      expect(body.data.id).toBeDefined();
      expect(body.data.createdAt).toBeDefined();
    });

    it("should return 404 when task does not exist", async () => {
      const { alice } = seedTestData();

      const res = await app.request("/tasks/nonexistent/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: alice.id,
          content: "Comment on missing task",
        }),
      });

      expect(res.status).toBe(404);
    });

    it("should return 400 when content is empty", async () => {
      const { alice, task } = seedTestData();

      const res = await app.request(`/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: alice.id,
          content: "",
        }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /tasks/:taskId/comments", () => {
    it("should return all comments for a task", async () => {
      const { alice, bob, task } = seedTestData();

      // Create 2 comments
      await app.request(`/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: alice.id, content: "First comment" }),
      });
      await app.request(`/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: bob.id, content: "Second comment" }),
      });

      const res = await app.request(`/tasks/${task.id}/comments`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data).toHaveLength(2);
    });

    it("should return empty array for task with no comments", async () => {
      const { task } = seedTestData();

      const res = await app.request(`/tasks/${task.id}/comments`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data).toEqual([]);
    });
  });

  describe("PATCH /tasks/:taskId/comments/:id", () => {
    it("should update comment content", async () => {
      const { alice, task } = seedTestData();

      const createRes = await app.request(`/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: alice.id, content: "Original" }),
      });
      const { data: comment } = await createRes.json();

      const res = await app.request(`/tasks/${task.id}/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Updated content" }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.content).toBe("Updated content");
    });
  });

  describe("GET /tasks/:taskId/comments/:id", () => {
    it("should return a single comment by id", async () => {
      const { alice, task } = seedTestData();

      const createRes = await app.request(`/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: alice.id, content: "A comment" }),
      });
      const { data: comment } = await createRes.json();

      const res = await app.request(`/tasks/${task.id}/comments/${comment.id}`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.content).toBe("A comment");
    });
  });
});
