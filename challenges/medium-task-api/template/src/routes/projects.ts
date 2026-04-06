import { Hono } from "hono";
import { projectStore, userStore } from "../store";
import { NotFoundError, ValidationError } from "../errors";
import { successResponse } from "../lib/response";
import { validate } from "../middleware/validate";
import { createProjectSchema, updateProjectSchema } from "../schemas/projectSchemas";

export const projectRoutes = new Hono();

// POST /projects
projectRoutes.post("/", validate(createProjectSchema), (c) => {
  const data = c.get("validated") as {
    name: string;
    description: string;
    authorId: string;
    memberIds?: string[];
  };

  const author = userStore.findUserById(data.authorId);
  if (!author) throw new ValidationError(`Author '${data.authorId}' not found`);

  const project = projectStore.createProject(data);
  return c.json(successResponse(project), 201);
});

// GET /projects
projectRoutes.get("/", (c) => {
  const projects = projectStore.findAllProjects();
  return c.json(successResponse(projects));
});

// GET /projects/:id
projectRoutes.get("/:id", (c) => {
  const project = projectStore.findProjectById(c.req.param("id"));
  if (!project) throw new NotFoundError("Project", c.req.param("id"));
  return c.json(successResponse(project));
});

// PATCH /projects/:id
projectRoutes.patch("/:id", validate(updateProjectSchema), (c) => {
  const data = c.get("validated") as {
    name?: string;
    description?: string;
    memberIds?: string[];
  };
  const project = projectStore.updateProject(c.req.param("id"), data);
  if (!project) throw new NotFoundError("Project", c.req.param("id"));
  return c.json(successResponse(project));
});

// DELETE /projects/:id (soft delete)
projectRoutes.delete("/:id", (c) => {
  const deleted = projectStore.softDeleteProject(c.req.param("id"));
  if (!deleted) throw new NotFoundError("Project", c.req.param("id"));
  return c.json(successResponse({ deleted: true }));
});
