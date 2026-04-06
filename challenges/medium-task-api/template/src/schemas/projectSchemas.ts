import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().default(""),
  authorId: z.string().min(1, "Author ID is required"),
  memberIds: z.array(z.string()).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
});
