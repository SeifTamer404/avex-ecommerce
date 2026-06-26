"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "@/store/slices/uiSlice";

function Toast({ notification }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Auto-dismiss toast
    const timer = setTimeout(() => {
      dispatch(uiActions.removeNotification(notification.id));
    }, notification.duration || 4000);

    // Clean up timer if manually dismissed before timeout
    return () => clearTimeout(timer);
  }, [dispatch, notification.id, notification.duration]);

  const handleDismiss = () => {
    dispatch(uiActions.removeNotification(notification.id));
  };

  let icon = "info";
  let colorClass = "text-blue-500";

  if (notification.type === "success") {
    icon = "check_circle";
    colorClass = "text-[#16a34a]";
  } else if (notification.type === "error") {
    icon = "error";
    colorClass = "text-[#ef4444]";
  } else if (notification.type === "warning") {
    icon = "warning";
    colorClass = "text-[#f59e0b]";
  }

  return (
    <div
      className="flex items-start gap-3 p-4 mb-3 w-80 rounded-2xl shadow-xl border bg-[var(--color-surface)] border-[var(--color-outline-variant)]/50 pointer-events-auto transition-all duration-300 ease-out animate-in slide-in-from-right-8 group relative"
      role="alert"
    >
      <span
        className={`material-symbols-outlined shrink-0 ${colorClass}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <p className="text-sm font-medium text-[var(--color-inverted-bg)] flex-1 leading-snug">
        {notification.message}
      </p>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className="text-[var(--color-inverted-bg)]/40 hover:text-[var(--color-inverted-bg)] transition-colors opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-[var(--color-outline-variant)]/20"
      >
        <span className="material-symbols-outlined block" style={{ fontSize: "1.1rem" }}>
          close
        </span>
      </button>
    </div>
  );
}

export default function NotificationContainer() {
  const notifications = useSelector((state) => state.ui.notifications);

  // Render nothing when empty
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-[80px] md:bottom-4 right-4 z-[9999] flex flex-col items-end pointer-events-none">
      {notifications.map((notif) => (
        <Toast key={notif.id} notification={notif} />
      ))}
    </div>
  );
}
