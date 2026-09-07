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
  X,
  ExternalLink,
} from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen && user?.id) {
      loadNotifications();
    }
  }, [isOpen, user?.id, role]);

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
        return 'text-blue-500 bg-blue-50';
      case 'application_update':
        return 'text-emerald-500 bg-emerald-50';
      case 'employer_message':
        return 'text-purple-500 bg-purple-50';
      case 'profile_approval':
        return 'text-green-500 bg-green-50';
      case 'review':
        return 'text-amber-500 bg-amber-50';
      case 'new_application':
        return 'text-blue-500 bg-blue-50';
      case 'matching_worker':
        return 'text-blue-500 bg-blue-50';
      case 'payment_confirmation':
        return 'text-emerald-500 bg-emerald-50';
      case 'phone_unlock':
        return 'text-emerald-500 bg-emerald-50';
      case 'system_announcement':
        return 'text-purple-500 bg-purple-50';
      default:
        return 'text-slate-500 bg-slate-50';
    }
  }

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Notifications</h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 mb-1">No notifications yet</p>
            <p className="text-xs text-slate-400">
              You will see notifications here when there are updates to your applications, jobs, profile, payments, or other important activities.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type);
              const timeAgo = getTimeAgo(notification.createdAt);

              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-slate-50 transition cursor-pointer ${!notification.isRead ? 'bg-purple-50/50' : ''}`}
                  onClick={() => {
                    if (!notification.isRead) {
                      handleMarkAsRead(notification.id);
                    }
                    onClose();
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${iconColor} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-900 text-sm">{notification.title}</p>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2">{timeAgo}</p>
                    </div>
                  </div>
                  {notification.relatedPage && (
                    <Link
                      href={notification.relatedPage}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View details
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-100">
        <Link
          href="/notifications"
          onClick={onClose}
          className="block text-center text-xs text-purple-600 hover:text-purple-700 font-semibold"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
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
