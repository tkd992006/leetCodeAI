import { describe, it, expect, beforeEach } from "vitest";
import { createTestApp, resetStores } from "./helpers";

describe("Users API", () => {
  const app = createTestApp();

  beforeEach(() => {
    resetStores();
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const res = await app.request("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Alice", email: "alice@test.com" }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.name).toBe("Alice");
      expect(body.data.email).toBe("alice@test.com");
      expect(body.data.id).toBeDefined();
      expect(body.data.deletedAt).toBeNull();
    });

    it("should return 400 for invalid email", async () => {
      const res = await app.request("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Alice", email: "not-an-email" }),
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
    });
  });

  describe("GET /users/:id", () => {
    it("should return a user by id", async () => {
      // Create first
      const createRes = await app.request("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Bob", email: "bob@test.com" }),
      });
      const { data: created } = await createRes.json();

      const res = await app.request(`/users/${created.id}`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.name).toBe("Bob");
    });

    it("should return 404 for non-existent user", async () => {
      const res = await app.request("/users/nonexistent");
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /users/:id", () => {
    it("should soft-delete a user", async () => {
      const createRes = await app.request("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Charlie", email: "charlie@test.com" }),
      });
      const { data: created } = await createRes.json();

      const deleteRes = await app.request(`/users/${created.id}`, { method: "DELETE" });
      expect(deleteRes.status).toBe(200);

      // User should no longer be found via API
      const getRes = await app.request(`/users/${created.id}`);
      expect(getRes.status).toBe(404);
    });
  });
});
