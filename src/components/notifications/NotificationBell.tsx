'use client';

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { notificationsService } from '@/services/notificationsService';
import { NotificationRole } from '@/types';

interface NotificationBellProps {
  onClick?: () => void;
}

export function NotificationBell({ onClick }: NotificationBellProps) {
  const { user, role } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      loadUnreadCount();
    }
  }, [user?.id, role]);

  async function loadUnreadCount() {
    if (!user?.id) return;
    const userRole: NotificationRole = role === 'admin' ? 'admin' : role === 'worker' ? 'worker' : 'employer';
    const count = await notificationsService.getUnreadCount(user.id, userRole);
    setUnreadCount(count);
  }

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-xl hover:bg-slate-100 transition"
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5 text-slate-600" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
