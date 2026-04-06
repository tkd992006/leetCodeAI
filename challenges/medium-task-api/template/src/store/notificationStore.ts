import type { Notification } from "../types";

const notifications = new Map<string, Notification>();
let nextId = 1;

function generateId(): string {
  return `notif-${nextId++}`;
}

export const notificationStore = {
  createNotification(recipientId: string, message: string): Notification {
    const notif: Notification = {
      id: generateId(),
      recipientId,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.set(notif.id, notif);
    return notif;
  },

  findNotificationsByRecipientId(recipientId: string): Notification[] {
    return Array.from(notifications.values()).filter(
      (n) => n.recipientId === recipientId,
    );
  },

  _reset(): void {
    notifications.clear();
    nextId = 1;
  },
};
