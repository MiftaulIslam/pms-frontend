import { useNotificationStore, type NotificationData } from "@/lib/notification-store"

export const useNotifications = () => {
    const add = useNotificationStore((s) => s.addNotification)
    const remove = useNotificationStore((s) => s.removeNotification)
    const clearAll = useNotificationStore((s) => s.clearAll)

    return {
        addNotification: (notification: Omit<NotificationData, "id">) => add(notification),
        removeNotification: (id: string) => remove(id),
        clearAll,
    }
}
