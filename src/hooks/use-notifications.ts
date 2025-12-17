import { useNotificationStore, type NotificationData } from "@/lib/notification-store"

export const useNotifications = () => {
    const add = useNotificationStore((s) => s.addNotification)
    const remove = useNotificationStore((s) => s.removeNotification)
    const clearAll = useNotificationStore((s) => s.clearAll)

    return {
        addNotification: (notification: Omit<NotificationData, "id">) => {
            // Default to 3 seconds if length is not provided
            const notificationWithDefaults = {
                ...notification,
                length: notification.length ?? 3000,
            };
            return add(notificationWithDefaults);
        },
        removeNotification: (id: string) => remove(id),
        clearAll,
    }
}
