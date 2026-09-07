'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { notificationsService } from '@/services/notificationsService';
import { Notification, NotificationRole } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Bell,
  Check,
  CheckCheck,
  Briefcase,
  User,
  CreditCard,
  Phone,
  MessageSquare,
  Star,
  FileCheck,
  Megaphone,
  ExternalLink,
  Trash2,
  Filter,
} from 'lucide-react';

export default function NotificationsPage() {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { showToast } = useToast();

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id, role]);

  async function loadNotifications() {
    if (!user?.id) return;
    setIsLoading(true);
    const userRole: NotificationRole = role === 'admin' ? 'admin' : role === 'worker' ? 'worker' : 'employer';
    const data = await notificationsService.getNotifications(user.id, userRole);
    setNotifications(data);
    setIsLoading(false);
  }

  async function handleMarkAsRead(notificationId: string) {
    await notificationsService.markAsRead(notificationId);
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)));
  }

  async function handleMarkAllAsRead() {
    if (!user?.id) return;
    const userRole: NotificationRole = role === 'admin' ? 'admin' : role === 'worker' ? 'worker' : 'employer';
    await notificationsService.markAllAsRead(user.id, userRole);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All Read', 'All notifications marked as read.', 'success');
  }

  async function handleDelete(notificationId: string) {
    if (confirm('Are you sure you want to delete this notification?')) {
      const success = await notificationsService.deleteNotification(notificationId);
      if (success) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        showToast('Deleted', 'Notification has been deleted.', 'success');
      }
    }
  }

  function getNotificationIcon(type: Notification['type']) {
    switch (type) {
      case 'matching_job':
        return Briefcase;
      case 'application_update':
        return FileCheck;
      case 'employer_message':
        return MessageSquare;
      case 'profile_approval':
        return Check;
      case 'review':
        return Star;
      case 'new_application':
        return User;
      case 'matching_worker':
        return User;
      case 'payment_confirmation':
        return CreditCard;
      case 'phone_unlock':
        return Phone;
      case 'system_announcement':
        return Megaphone;
      default:
        return Bell;
    }
  }

  function getNotificationColor(type: Notification['type']) {
    switch (type) {
      case 'matching_job':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'application_update':
        return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'employer_message':
        return 'text-purple-500 bg-purple-50 border-purple-200';
      case 'profile_approval':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'review':
        return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'new_application':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'matching_worker':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'payment_confirmation':
        return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'phone_unlock':
        return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'system_announcement':
        return 'text-purple-500 bg-purple-50 border-purple-200';
      default:
        return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  }

  function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
              <p className="text-sm text-slate-500 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Filter */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-slate-400" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
              filter === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
              filter === 'unread' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 mt-4">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No notifications</h3>
            <p className="text-sm text-slate-500">
              {filter === 'unread'
                ? 'You have no unread notifications.'
                : 'You will see notifications here when there are updates to your applications, jobs, profile, payments, or other important activities.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type);
              const timeAgo = getTimeAgo(notification.createdAt);

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl border p-4 hover:shadow-md transition ${
                    !notification.isRead ? 'border-purple-300 bg-purple-50/30' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${iconColor} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1.5 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">{notification.message}</p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-slate-400">{timeAgo}</p>
                        {notification.relatedPage && (
                          <Link
                            href={notification.relatedPage}
                            className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-semibold"
                          >
                            View details
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
