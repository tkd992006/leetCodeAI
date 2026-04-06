import { describe, it, expect, beforeEach } from "vitest";
import { createTestApp, resetStores, seedTestData } from "./helpers";
import { notificationStore } from "../src/store";

/**
 * Tests for comment notification behavior.
 */
describe("Comments — Notification behavior", () => {
  const app = createTestApp();

  beforeEach(() => {
    resetStores();
  });

  it("should notify all project members when a comment is added", async () => {
    const { alice, bob, task, project } = seedTestData();

    // Alice comments on Bob's assigned task
    await app.request(`/tasks/${task.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorId: alice.id, content: "Great progress!" }),
    });

    // All project members (alice + bob) should receive notifications
    const aliceNotifs = notificationStore.findNotificationsByRecipientId(alice.id);
    const bobNotifs = notificationStore.findNotificationsByRecipientId(bob.id);

    expect(aliceNotifs.length).toBeGreaterThanOrEqual(1);
    expect(bobNotifs.length).toBeGreaterThanOrEqual(1);

    // Both members should be notified about the comment
    const allNotifs = [...aliceNotifs, ...bobNotifs];
    expect(allNotifs.some((n) => n.message.includes("comment"))).toBe(true);
  });
});
