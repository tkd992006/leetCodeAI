// ── Entity types ──

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type TaskStatus = "open" | "in-progress" | "completed";

export interface EditHistoryEntry {
  previousContent: string;
  editedAt: string;
}

export interface Task {
  id: string;
  title: string;
  content: string;
  status: TaskStatus;
  authorId: string;
  assigneeId: string | null;
  projectId: string;
  editHistory: EditHistoryEntry[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Notification {
  id: string;
  recipientId: string;
  message: string;
  read: boolean;
  createdAt: string;
}
