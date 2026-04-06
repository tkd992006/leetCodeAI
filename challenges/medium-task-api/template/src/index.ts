import { Hono } from "hono";
import { userRoutes } from "./routes/users";
import { projectRoutes } from "./routes/projects";
import { taskRoutes } from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";
import { seedData } from "./seed";

const app = new Hono();

// Global error handler
app.onError(errorHandler);

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

// Mount routes
app.route("/users", userRoutes);
app.route("/projects", projectRoutes);
app.route("/tasks", taskRoutes);

// Seed data on startup
seedData();

export default {
  port: 3000,
  fetch: app.fetch,
};

export { app };
