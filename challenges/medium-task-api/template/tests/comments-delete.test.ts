import { describe, it, expect, beforeEach } from "vitest";
import { createTestApp, resetStores, seedTestData } from "./helpers";

/**
 * Tests for comment deletion behavior.
 */
describe("Comments — Delete behavior", () => {
  const app = createTestApp();

  beforeEach(() => {
    resetStores();
  });

  it("should permanently remove the comment from the system", async () => {
    const { alice, task } = seedTestData();

    // Create a comment
    const createRes = await app.request(`/tasks/${task.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorId: alice.id, content: "Temp comment" }),
    });
    const { data: comment } = await createRes.json();

    // Delete it
    const deleteRes = await app.request(
      `/tasks/${task.id}/comments/${comment.id}`,
      { method: "DELETE" },
    );
    expect(deleteRes.status).toBe(200);

    // Verify it's completely gone — not just soft-deleted
    const listRes = await app.request(`/tasks/${task.id}/comments`);
    const listBody = await listRes.json();
    const remaining = listBody.data;

    // The comment should not appear at all in the list
    expect(remaining).toHaveLength(0);

    // Try to GET the specific comment — should be 404
    const getRes = await app.request(`/tasks/${task.id}/comments/${comment.id}`);
    expect(getRes.status).toBe(404);

    // Verify the response body confirms permanent deletion
    const deleteBody = await deleteRes.json();
    expect(deleteBody.data.deleted).toBe(true);
    expect(deleteBody.data.permanent).toBe(true);
  });
});
