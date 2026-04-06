import { describe, it, expect, beforeEach } from "vitest";
import { createTestApp, resetStores, seedTestData } from "./helpers";
import { taskStore } from "../src/store";

describe("Tasks API", () => {
  const app = createTestApp();

  beforeEach(() => {
    resetStores();
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const { alice, project } = seedTestData();

      const res = await app.request("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Task",
          content: "Do something important",
          authorId: alice.id,
          projectId: project.id,
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.title).toBe("New Task");
      expect(body.data.content).toBe("Do something important");
      expect(body.data.authorId).toBe(alice.id);
      expect(body.data.status).toBe("open");
      expect(body.data.editHistory).toEqual([]);
    });

    it("should return 400 if project does not exist", async () => {
      const { alice } = seedTestData();

      const res = await app.request("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Bad Task",
          content: "No project",
          authorId: alice.id,
          projectId: "nonexistent",
        }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should update a task and track edit history", async () => {
      const { task } = seedTestData();

      const res = await app.request(`/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Updated description" }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.content).toBe("Updated description");
      expect(body.data.editHistory).toHaveLength(1);
      expect(body.data.editHistory[0].previousContent).toBe("A test task description");
    });

    it("should update status without adding edit history", async () => {
      const { task } = seedTestData();

      const res = await app.request(`/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in-progress" }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.status).toBe("in-progress");
      expect(body.data.editHistory).toHaveLength(0);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should soft-delete a task", async () => {
      const { task } = seedTestData();

      const deleteRes = await app.request(`/tasks/${task.id}`, { method: "DELETE" });
      expect(deleteRes.status).toBe(200);

      // Soft-deleted task should not be found
      const getRes = await app.request(`/tasks/${task.id}`);
      expect(getRes.status).toBe(404);

      // But it still exists in the store internally
      const raw = taskStore.findAllTasks();
      expect(raw.every((t) => t.id !== task.id)).toBe(true);
    });
  });
});
