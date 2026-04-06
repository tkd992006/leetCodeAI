import { Hono } from "hono";
import { userRoutes } from "../src/routes/users";
import { projectRoutes } from "../src/routes/projects";
import { taskRoutes } from "../src/routes/tasks";
import { errorHandler } from "../src/middleware/errorHandler";
import { userStore, projectStore, taskStore, notificationStore } from "../src/store";

/**
 * Create a fresh Hono app instance for testing.
 * Mounts all routes with the error handler.
 */
export function createTestApp(): Hono {
  const app = new Hono();
  app.onError(errorHandler);
  app.route("/users", userRoutes);
  app.route("/projects", projectRoutes);
  app.route("/tasks", taskRoutes);
  return app;
}

/**
 * Reset all stores between tests.
 */
export function resetStores(): void {
  userStore._reset();
  projectStore._reset();
  taskStore._reset();
  notificationStore._reset();
}

/**
 * Seed basic test data: 2 users, 1 project, 1 task.
 * Returns the seeded entities.
 */
export function seedTestData() {
  const alice = userStore.createUser({ name: "Alice", email: "alice@test.com" });
  const bob = userStore.createUser({ name: "Bob", email: "bob@test.com" });

  const project = projectStore.createProject({
    name: "Test Project",
    description: "A test project",
    authorId: alice.id,
    memberIds: [alice.id, bob.id],
  });

  const task = taskStore.createTask({
    title: "Test Task",
    content: "A test task description",
    authorId: alice.id,
    projectId: project.id,
    assigneeId: bob.id,
  });

  return { alice, bob, project, task };
}
