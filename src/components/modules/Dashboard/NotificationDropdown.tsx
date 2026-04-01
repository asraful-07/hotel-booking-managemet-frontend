"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  UserPlus,
  Sparkles,
  Bed,
  Hotel,
  Star,
  Users,
  CreditCard,
  MessageSquare,
  Heart,
  Gift,
} from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "booking" | "checkin" | "payment" | "review" | "wishlist" | "offer";
  timestamp: Date;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New Booking Confirmed",
    message: "Deluxe Suite booked by Mr. John Doe for April 15-20, 2026.",
    type: "booking",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
  },
  {
    id: "2",
    title: "Guest Checked In",
    message: "Ms. Sarah Johnson has checked in to Room 304 (Premium Suite).",
    type: "checkin",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: "3",
    title: "Payment Received",
    message:
      "Payment of $450 received from Mr. Michael Brown for 2-night stay.",
    type: "payment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: false,
  },
  {
    id: "4",
    title: "New Review Posted",
    message: "★★★★★ - Amazing experience! Guest Emily Wilson rated Room 105.",
    type: "review",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: "5",
    title: "Room Added to Wishlist",
    message: "Ocean View Suite was added to 5 guests' wishlists this week.",
    type: "wishlist",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: false,
  },
  {
    id: "6",
    title: "Special Offer Available",
    message:
      "Weekend getaway: 20% off on all Deluxe Rooms. Valid until May 31.",
    type: "offer",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    read: true,
  },
  {
    id: "7",
    title: "Check-out Reminder",
    message: "Room 202 (Mr. David Lee) checking out today at 12:00 PM.",
    type: "checkin",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    read: false,
  },
  {
    id: "8",
    title: "Booking Modification",
    message: "Booking #INV-10234 extended by 2 more nights.",
    type: "booking",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
  {
    id: "9",
    title: "Payment Failed",
    message: "Payment for Booking #INV-10235 failed. Guest notified.",
    type: "payment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30),
    read: false,
  },
];

const TYPE_CONFIG = {
  booking: {
    icon: Calendar,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
    dot: "bg-emerald-500",
    label: "Booking",
  },
  checkin: {
    icon: Bed,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/20",
    dot: "bg-blue-500",
    label: "Check-in",
  },
  payment: {
    icon: CreditCard,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
    dot: "bg-amber-500",
    label: "Payment",
  },
  review: {
    icon: Star,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    ring: "ring-yellow-500/20",
    dot: "bg-yellow-500",
    label: "Review",
  },
  wishlist: {
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/20",
    dot: "bg-rose-500",
    label: "Wishlist",
  },
  offer: {
    icon: Gift,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    ring: "ring-purple-500/20",
    dot: "bg-purple-500",
    label: "Offer",
  },
};

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 rounded-xl border-[#e8d9cc] bg-white hover:bg-[#f5f0ea] transition-all duration-200"
        >
          <Bell className="h-4 w-4 text-[#8b6946] hover:text-[#caa05c]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#caa05c] flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[400px] p-0 rounded-2xl border border-[#e8d9cc] shadow-xl shadow-black/10 overflow-hidden bg-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#e8d9cc] bg-[#faf8f5]">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#caa05c]/10 flex items-center justify-center">
              <Bell className="h-3.5 w-3.5 text-[#caa05c]" />
            </div>
            <span className="font-semibold text-sm text-[#2c1810]">
              Notifications
            </span>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px] font-semibold bg-[#caa05c]/10 text-[#caa05c] border-0 rounded-full"
              >
                {unreadCount} new
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-[11px] font-medium text-[#ab8965] hover:text-[#caa05c] transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="p-2 space-y-0.5">
              {notifications.map((notification) => {
                const config = TYPE_CONFIG[notification.type];
                const Icon = config.icon;

                return (
                  <button
                    key={notification.id}
                    onClick={() => markOneRead(notification.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-150 group
                      ${
                        !notification.read
                          ? "bg-[#caa05c]/5 hover:bg-[#caa05c]/10"
                          : "hover:bg-[#faf8f5]"
                      }`}
                  >
                    {/* Icon */}
                    <div
                      className={`mt-0.5 h-8 w-8 rounded-xl ${config.bg} ring-1 ${config.ring} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-medium leading-tight ${!notification.read ? "text-[#2c1810]" : "text-[#ab8965]"}`}
                        >
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          {!notification.read && (
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${config.dot} shrink-0`}
                            />
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-[#8b6946] leading-relaxed line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-2 pt-0.5">
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${config.bg} ${config.color}`}
                        >
                          {config.label}
                        </span>
                        <span className="text-[10px] text-[#ab8965]">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
              <div className="h-12 w-12 rounded-2xl bg-[#f5f0ea] flex items-center justify-center">
                <Bell className="h-5 w-5 text-[#ab8965]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#2c1810]">
                  All caught up!
                </p>
                <p className="text-xs text-[#ab8965] mt-0.5">
                  No new notifications
                </p>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-[#e8d9cc] bg-[#faf8f5]">
          <button className="w-full px-4 py-3 text-xs font-semibold text-[#caa05c] hover:text-[#b8894a] hover:bg-[#f5f0ea] transition-all duration-150 flex items-center justify-center gap-1.5">
            View all notifications
            <span className="text-[#ab8965] font-normal">→</span>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
