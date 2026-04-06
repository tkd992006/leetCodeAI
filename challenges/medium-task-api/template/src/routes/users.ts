import { Hono } from "hono";
import { userStore } from "../store";
import { NotFoundError } from "../errors";
import { successResponse } from "../lib/response";
import { validate } from "../middleware/validate";
import { createUserSchema, updateUserSchema } from "../schemas/userSchemas";

export const userRoutes = new Hono();

// POST /users
userRoutes.post("/", validate(createUserSchema), (c) => {
  const data = c.get("validated") as { name: string; email: string };
  const user = userStore.createUser(data);
  return c.json(successResponse(user), 201);
});

// GET /users
userRoutes.get("/", (c) => {
  const users = userStore.findAllUsers();
  return c.json(successResponse(users));
});

// GET /users/:id
userRoutes.get("/:id", (c) => {
  const user = userStore.findUserById(c.req.param("id"));
  if (!user) throw new NotFoundError("User", c.req.param("id"));
  return c.json(successResponse(user));
});

// PATCH /users/:id
userRoutes.patch("/:id", validate(updateUserSchema), (c) => {
  const data = c.get("validated") as { name?: string; email?: string };
  const user = userStore.updateUser(c.req.param("id"), data);
  if (!user) throw new NotFoundError("User", c.req.param("id"));
  return c.json(successResponse(user));
});

// DELETE /users/:id (soft delete)
userRoutes.delete("/:id", (c) => {
  const deleted = userStore.softDeleteUser(c.req.param("id"));
  if (!deleted) throw new NotFoundError("User", c.req.param("id"));
  return c.json(successResponse({ deleted: true }));
});
