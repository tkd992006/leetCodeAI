import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  authorId: z.string().min(1, "Author ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  assigneeId: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  status: z.enum(["open", "in-progress", "completed"]).optional(),
  assigneeId: z.string().nullable().optional(),
});
