import { create } from 'zustand'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationData {
  id: string
  type: NotificationType
  title?: string
  message: string
  footer?: string
  length?: number
  persistent?: boolean
}

interface NotificationState {
  notifications: NotificationData[]
  addNotification: (n: Omit<NotificationData, 'id'>) => string
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (payload) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: NotificationData = {
      ...payload,
      id,
      persistent: payload.persistent || !payload.length,
    }
    set((state) => ({ notifications: [...state.notifications, newNotification] }))
    return id
  },
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
  clearAll: () => set({ notifications: [] }),
}))
