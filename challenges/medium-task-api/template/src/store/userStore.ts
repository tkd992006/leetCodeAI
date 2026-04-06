import type { User } from "../types";

const users = new Map<string, User>();
let nextId = 1;

function generateId(): string {
  return `user-${nextId++}`;
}

export const userStore = {
  createUser(data: { name: string; email: string }): User {
    const now = new Date().toISOString();
    const user: User = {
      id: generateId(),
      name: data.name,
      email: data.email,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    users.set(user.id, user);
    return user;
  },

  findUserById(id: string): User | undefined {
    const user = users.get(id);
    if (!user || user.deletedAt !== null) return undefined;
    return user;
  },

  findAllUsers(): User[] {
    return Array.from(users.values()).filter((u) => u.deletedAt === null);
  },

  updateUser(id: string, data: Partial<Pick<User, "name" | "email">>): User | undefined {
    const user = users.get(id);
    if (!user || user.deletedAt !== null) return undefined;

    if (data.name !== undefined) user.name = data.name;
    if (data.email !== undefined) user.email = data.email;
    user.updatedAt = new Date().toISOString();

    return user;
  },

  softDeleteUser(id: string): boolean {
    const user = users.get(id);
    if (!user || user.deletedAt !== null) return false;

    user.deletedAt = new Date().toISOString();
    return true;
  },

  /** Reset store — test helper only */
  _reset(): void {
    users.clear();
    nextId = 1;
  },
};
