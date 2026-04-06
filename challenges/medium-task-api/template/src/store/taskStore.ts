import type { Task, TaskStatus, EditHistoryEntry } from "../types";

const tasks = new Map<string, Task>();
let nextId = 1;

function generateId(): string {
  return `task-${nextId++}`;
}

export const taskStore = {
  createTask(data: {
    title: string;
    content: string;
    authorId: string;
    projectId: string;
    assigneeId?: string;
  }): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: generateId(),
      title: data.title,
      content: data.content,
      status: "open",
      authorId: data.authorId,
      assigneeId: data.assigneeId ?? null,
      projectId: data.projectId,
      editHistory: [],
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    tasks.set(task.id, task);
    return task;
  },

  findTaskById(id: string): Task | undefined {
    const task = tasks.get(id);
    if (!task || task.deletedAt !== null) return undefined;
    return task;
  },

  findTasksByProjectId(projectId: string): Task[] {
    return Array.from(tasks.values()).filter(
      (t) => t.deletedAt === null && t.projectId === projectId,
    );
  },

  findTasksByAssigneeId(assigneeId: string): Task[] {
    return Array.from(tasks.values()).filter(
      (t) => t.deletedAt === null && t.assigneeId === assigneeId,
    );
  },

  findAllTasks(): Task[] {
    return Array.from(tasks.values()).filter((t) => t.deletedAt === null);
  },

  updateTask(
    id: string,
    data: Partial<Pick<Task, "title" | "content" | "status" | "assigneeId">>,
  ): Task | undefined {
    const task = tasks.get(id);
    if (!task || task.deletedAt !== null) return undefined;

    // Track edit history when content changes
    if (data.content !== undefined && data.content !== task.content) {
      const entry: EditHistoryEntry = {
        previousContent: task.content,
        editedAt: new Date().toISOString(),
      };
      task.editHistory.push(entry);
    }

    if (data.title !== undefined) task.title = data.title;
    if (data.content !== undefined) task.content = data.content;
    if (data.status !== undefined) task.status = data.status;
    if (data.assigneeId !== undefined) task.assigneeId = data.assigneeId;
    task.updatedAt = new Date().toISOString();

    return task;
  },

  softDeleteTask(id: string): boolean {
    const task = tasks.get(id);
    if (!task || task.deletedAt !== null) return false;

    task.deletedAt = new Date().toISOString();
    return true;
  },

  _reset(): void {
    tasks.clear();
    nextId = 1;
  },
};
