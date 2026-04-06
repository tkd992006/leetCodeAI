import { describe, it, expect, beforeEach } from "vitest";
import { createTestApp, resetStores } from "./helpers";
import { userStore } from "../src/store";

describe("Projects API", () => {
  const app = createTestApp();

  beforeEach(() => {
    resetStores();
  });

  describe("POST /projects", () => {
    it("should create a new project", async () => {
      const user = userStore.createUser({ name: "Alice", email: "alice@test.com" });

      const res = await app.request("/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "New Project",
          description: "A great project",
          authorId: user.id,
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.name).toBe("New Project");
      expect(body.data.authorId).toBe(user.id);
      expect(body.data.memberIds).toContain(user.id);
    });

    it("should return 400 if author does not exist", async () => {
      const res = await app.request("/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Bad Project",
          description: "",
          authorId: "nonexistent",
        }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /projects/:id", () => {
    it("should soft-delete a project", async () => {
      const user = userStore.createUser({ name: "Bob", email: "bob@test.com" });

      const createRes = await app.request("/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Temp Project",
          description: "",
          authorId: user.id,
        }),
      });
      const { data: created } = await createRes.json();

      const deleteRes = await app.request(`/projects/${created.id}`, { method: "DELETE" });
      expect(deleteRes.status).toBe(200);

      const getRes = await app.request(`/projects/${created.id}`);
      expect(getRes.status).toBe(404);
    });
  });
});
