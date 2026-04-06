import { describe, it, expect, beforeEach } from "vitest";
import { createTestApp, resetStores, seedTestData } from "./helpers";

/**
 * Tests for comment creation with field naming.
 * Verifies that comments use the correct field names per the data model.
 */
describe("Comments — Field naming", () => {
  const app = createTestApp();

  beforeEach(() => {
    resetStores();
  });

  it("should include userId and text in the comment response", async () => {
    const { alice, task } = seedTestData();

    const res = await app.request(`/tasks/${task.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: alice.id,
        text: "This is a comment",
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.userId).toBe(alice.id);
    expect(body.data.text).toBe("This is a comment");
  });
});
