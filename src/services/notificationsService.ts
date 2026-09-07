import { Notification, NotificationType, NotificationRole, NotificationPreferences } from '@/types';
import { mockNotifications } from '@/data/mockNotifications';

export const notificationsService = {
  async getNotifications(userId: string, userRole: NotificationRole): Promise<Notification[]> {
    const userNotifications = mockNotifications.filter(
      (n) => n.userId === userId && (n.userRole === userRole || n.userRole === 'all')
    );
    return [...userNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getUnreadNotifications(userId: string, userRole: NotificationRole): Promise<Notification[]> {
    const all = await this.getNotifications(userId, userRole);
    return all.filter((n) => !n.isRead);
  },

  async getUnreadCount(userId: string, userRole: NotificationRole): Promise<number> {
    const unread = await this.getUnreadNotifications(userId, userRole);
    return unread.length;
  },

  async markAsRead(notificationId: string): Promise<Notification | null> {
    const notification = mockNotifications.find((n) => n.id === notificationId);
    if (!notification) return null;

    notification.isRead = true;
    notification.readAt = new Date().toISOString();
    return { ...notification };
  },

  async markAllAsRead(userId: string, userRole: NotificationRole): Promise<Notification[]> {
    const userNotifications = mockNotifications.filter(
      (n) => n.userId === userId && (n.userRole === userRole || n.userRole === 'all')
    );

    userNotifications.forEach((n) => {
      if (!n.isRead) {
        n.isRead = true;
        n.readAt = new Date().toISOString();
      }
    });

    return [...userNotifications];
  },

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    mockNotifications.unshift(newNotification);
    return newNotification;
  },

  async deleteNotification(notificationId: string): Promise<boolean> {
    const index = mockNotifications.findIndex((n) => n.id === notificationId);
    if (index === -1) return false;
    mockNotifications.splice(index, 1);
    return true;
  },

  // Notification creation helpers for different events
  async createMatchingJobNotification(
    userId: string,
    jobId: string,
    jobTitle: string,
    location: string
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      userRole: 'worker',
      type: 'matching_job',
      title: 'New Matching Job Available',
      message: `A new job "${jobTitle}" in ${location} matches your skills and location.`,
      isRead: false,
      relatedRecordId: jobId,
      relatedPage: `/jobs/${jobId}`,
    });
  },

  async createApplicationUpdateNotification(
    userId: string,
    applicationId: string,
    jobTitle: string,
    status: string
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      userRole: 'worker',
      type: 'application_update',
      title: 'Application Update',
      message: `Your application for "${jobTitle}" has been ${status.toLowerCase()}.`,
      isRead: false,
      relatedRecordId: applicationId,
      relatedPage: '/worker/applications',
    });
  },

  async createProfileApprovalNotification(userId: string): Promise<Notification> {
    return this.createNotification({
      userId,
      userRole: 'worker',
      type: 'profile_approval',
      title: 'Profile Approved',
      message: 'Your worker profile has been approved and is now visible to employers.',
      isRead: false,
      relatedRecordId: userId,
      relatedPage: '/worker/profile',
    });
  },

  async createReviewNotification(userId: string, reviewId: string): Promise<Notification> {
    return this.createNotification({
      userId,
      userRole: 'worker',
      type: 'review',
      title: 'New Review Received',
      message: 'An employer has submitted a review for your profile.',
      isRead: false,
      relatedRecordId: reviewId,
      relatedPage: '/worker/profile',
    });
  },

  async createNewApplicationNotification(
    userId: string,
    applicationId: string,
    jobTitle: string,
    workerName: string
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      userRole: 'employer',
      type: 'new_application',
      title: 'New Application Received',
      message: `You received a new application for "${jobTitle}" from ${workerName}.`,
      isRead: false,
      relatedRecordId: applicationId,
      relatedPage: '/employer/applications',
    });
  },

  async createMatchingWorkerNotification(
    userId: string,
    workerId: string,
    jobTitle: string
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      userRole: 'employer',
      type: 'matching_worker',
      title: 'Matching Worker Available',
      message: `A new worker matching your search criteria for "${jobTitle}" is available.`,
      isRead: false,
      relatedRecordId: workerId,
      relatedPage: `/workers/${workerId}`,
    });
  },

  async createPaymentConfirmationNotification(
    userId: string,
    paymentId: string,
    amount: number
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      userRole: 'employer',
      type: 'payment_confirmation',
      title: 'Payment Successful',
      message: `Your ${amount} ETB phone unlock payment was successful.`,
      isRead: false,
      relatedRecordId: paymentId,
      relatedPage: '/employer/unlocks',
    });
  },

  async createPhoneUnlockNotification(
    userId: string,
    unlockId: string
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      userRole: 'employer',
      type: 'phone_unlock',
      title: 'Phone Number Unlocked',
      message: 'The worker phone number has been successfully unlocked.',
      isRead: false,
      relatedRecordId: unlockId,
      relatedPage: '/employer/unlocks',
    });
  },

  async createSystemAnnouncement(
    userId: string,
    userRole: NotificationRole,
    message: string
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      userRole,
      type: 'system_announcement',
      title: 'System Announcement',
      message,
      isRead: false,
    });
  },

  async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    // Default preferences - in production this would come from database
    return {
      userId,
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      matchingJobEnabled: true,
      applicationUpdateEnabled: true,
      messageEnabled: true,
      reviewEnabled: true,
      systemAnnouncementEnabled: true,
    };
  },

  async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const current = await this.getNotificationPreferences(userId);
    return { ...current, ...preferences };
  },
};
