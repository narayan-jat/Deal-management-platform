import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '@/services/NotificationService';
import { NotificationModel } from '@/types/Notification';
import { useAuth } from '@/context/AuthProvider';

export interface UseNotificationsReturn {
  notifications: NotificationModel[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  createNotification: (notification: Partial<NotificationModel>) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const [allNotifications, unreadNotifications] = await Promise.all([
        NotificationService.getNotifications(user.id),
        NotificationService.getUnreadNotifications(user.id)
      ]);

      setNotifications(allNotifications);
      setUnreadCount(unreadNotifications.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.id) return;

    try {
      setError(null);
      
      await NotificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
    }
  }, [user?.id]);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      setError(null);
      
      await NotificationService.markAllAsRead(user.id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', err);
    }
  }, [user?.id]);

  const createNotification = useCallback(async (notification: Partial<NotificationModel>) => {
    if (!user?.id) return;

    try {
      setError(null);
      
      const newNotification = await NotificationService.createNotification({
        ...notification,
        userId: user.id,
        read: false,
      });

      if (newNotification && newNotification[0]) {
        // Add new notification to the beginning of the list
        setNotifications(prev => [newNotification[0], ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create notification');
      console.error('Error creating notification:', err);
    }
  }, [user?.id]);

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    refreshNotifications,
  };
}
