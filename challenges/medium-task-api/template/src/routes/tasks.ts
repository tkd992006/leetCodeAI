import { Hono } from "hono";
import { taskStore, userStore, projectStore } from "../store";
import { NotFoundError, ValidationError } from "../errors";
import { successResponse } from "../lib/response";
import { validate } from "../middleware/validate";
import { createTaskSchema, updateTaskSchema } from "../schemas/taskSchemas";
import { notifyUser } from "../lib/notifications";

export const taskRoutes = new Hono();

// POST /tasks
taskRoutes.post("/", validate(createTaskSchema), (c) => {
  const data = c.get("validated") as {
    title: string;
    content: string;
    authorId: string;
    projectId: string;
    assigneeId?: string;
  };

  const author = userStore.findUserById(data.authorId);
  if (!author) throw new ValidationError(`Author '${data.authorId}' not found`);

  const project = projectStore.findProjectById(data.projectId);
  if (!project) throw new ValidationError(`Project '${data.projectId}' not found`);

  if (data.assigneeId) {
    const assignee = userStore.findUserById(data.assigneeId);
    if (!assignee) throw new ValidationError(`Assignee '${data.assigneeId}' not found`);
  }

  const task = taskStore.createTask(data);

  // Notify assignee (if assigned and not the author)
  if (task.assigneeId && task.assigneeId !== task.authorId) {
    notifyUser(task.assigneeId, `You were assigned to task: ${task.title}`);
  }

  return c.json(successResponse(task), 201);
});

// GET /tasks
taskRoutes.get("/", (c) => {
  const projectId = c.req.query("projectId");
  const assigneeId = c.req.query("assigneeId");

  if (projectId) {
    return c.json(successResponse(taskStore.findTasksByProjectId(projectId)));
  }
  if (assigneeId) {
    return c.json(successResponse(taskStore.findTasksByAssigneeId(assigneeId)));
  }
  return c.json(successResponse(taskStore.findAllTasks()));
});

// GET /tasks/:id
taskRoutes.get("/:id", (c) => {
  const task = taskStore.findTaskById(c.req.param("id"));
  if (!task) throw new NotFoundError("Task", c.req.param("id"));
  return c.json(successResponse(task));
});

// PATCH /tasks/:id
taskRoutes.patch("/:id", validate(updateTaskSchema), (c) => {
  const data = c.get("validated") as {
    title?: string;
    content?: string;
    status?: string;
    assigneeId?: string | null;
  };
  const task = taskStore.updateTask(c.req.param("id"), data);
  if (!task) throw new NotFoundError("Task", c.req.param("id"));
  return c.json(successResponse(task));
});

// DELETE /tasks/:id (soft delete)
taskRoutes.delete("/:id", (c) => {
  const deleted = taskStore.softDeleteTask(c.req.param("id"));
  if (!deleted) throw new NotFoundError("Task", c.req.param("id"));
  return c.json(successResponse({ deleted: true }));
});
