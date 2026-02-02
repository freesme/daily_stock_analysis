import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  
  // Convenience methods
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

let notificationId = 0;

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = `notification-${++notificationId}`;
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
    
    // Auto remove after duration
    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, duration);
    }
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),

  success: (message, duration) =>
    set((state) => {
      const id = `notification-${++notificationId}`;
      setTimeout(() => {
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id),
        }));
      }, duration ?? 5000);
      return {
        notifications: [...state.notifications, { id, message, type: 'success', duration }],
      };
    }),

  error: (message, duration) =>
    set((state) => {
      const id = `notification-${++notificationId}`;
      setTimeout(() => {
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id),
        }));
      }, duration ?? 8000);
      return {
        notifications: [...state.notifications, { id, message, type: 'error', duration }],
      };
    }),

  warning: (message, duration) =>
    set((state) => {
      const id = `notification-${++notificationId}`;
      setTimeout(() => {
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id),
        }));
      }, duration ?? 6000);
      return {
        notifications: [...state.notifications, { id, message, type: 'warning', duration }],
      };
    }),

  info: (message, duration) =>
    set((state) => {
      const id = `notification-${++notificationId}`;
      setTimeout(() => {
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id),
        }));
      }, duration ?? 5000);
      return {
        notifications: [...state.notifications, { id, message, type: 'info', duration }],
      };
    }),
}));
