import { userStore, projectStore, taskStore } from "./store";

/**
 * Seed sample data for development/testing.
 * Creates 3 users, 2 projects, and 5 tasks.
 */
export function seedData() {
  // Users
  const alice = userStore.createUser({ name: "Alice Kim", email: "alice@example.com" });
  const bob = userStore.createUser({ name: "Bob Park", email: "bob@example.com" });
  const charlie = userStore.createUser({ name: "Charlie Lee", email: "charlie@example.com" });

  // Projects
  const webProject = projectStore.createProject({
    name: "Web Redesign",
    description: "Redesign the company website",
    authorId: alice.id,
    memberIds: [alice.id, bob.id, charlie.id],
  });

  const apiProject = projectStore.createProject({
    name: "API v2",
    description: "Build the next version of the API",
    authorId: bob.id,
    memberIds: [bob.id, charlie.id],
  });

  // Tasks
  taskStore.createTask({
    title: "Design homepage mockup",
    content: "Create wireframes for the new homepage layout",
    authorId: alice.id,
    projectId: webProject.id,
    assigneeId: bob.id,
  });

  taskStore.createTask({
    title: "Fix navigation bug",
    content: "Mobile nav menu doesn't close on route change",
    authorId: bob.id,
    projectId: webProject.id,
    assigneeId: alice.id,
  });

  taskStore.createTask({
    title: "Write API documentation",
    content: "Document all v2 endpoints with examples",
    authorId: bob.id,
    projectId: apiProject.id,
    assigneeId: charlie.id,
  });

  taskStore.createTask({
    title: "Set up CI/CD pipeline",
    content: "Configure GitHub Actions for automated testing and deployment",
    authorId: charlie.id,
    projectId: apiProject.id,
    assigneeId: bob.id,
  });

  taskStore.createTask({
    title: "Review security headers",
    content: "Audit and update security headers for all API responses",
    authorId: alice.id,
    projectId: apiProject.id,
  });

  console.log(
    `Seeded: ${userStore.findAllUsers().length} users, ` +
    `${projectStore.findAllProjects().length} projects, ` +
    `${taskStore.findAllTasks().length} tasks`,
  );
}
