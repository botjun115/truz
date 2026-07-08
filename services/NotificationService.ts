import type { AppNotification } from "@/types/notification";
import { notImplemented } from "@/utils/errors";

export const NotificationService = {
  listNotifications(_userId: string): Promise<AppNotification[]> {
    return notImplemented("NotificationService.listNotifications");
  },
  markAsRead(_notificationId: string): Promise<void> {
    return notImplemented("NotificationService.markAsRead");
  },
};
