import { notificationStore } from "../store";

/**
 * Notify all members of a project.
 * Used for project-level events (member added, project updated, etc.)
 */
export function notifyProjectMembers(
  projectId: string,
  memberIds: string[],
  message: string,
): void {
  for (const memberId of memberIds) {
    notificationStore.createNotification(memberId, message);
  }
}

/**
 * Notify a single user.
 * Used for targeted notifications (task assignment, etc.)
 */
export function notifyUser(userId: string, message: string): void {
  notificationStore.createNotification(userId, message);
}
