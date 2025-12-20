/* eslint-disable prefer-const */
import { useState, useEffect, useCallback, useRef } from "react"
import { CheckCircle, XCircle, AlertTriangle, Info, X, Clock, Sparkles } from "lucide-react"
import { useNotificationStore } from "@/lib/notification-store"
import type { NotificationData } from "@/lib/notification-store"
import "@/styles/notification-styles.css"

interface NotificationProps extends NotificationData {
    index: number
    onClose: (id: string) => void
}

const typeConfig = {
    success: {
        icon: CheckCircle,
        bgColor: "bg-gray-800",
        borderColor: "border-emerald-400",
        iconColor: "text-emerald-400",
        titleColor: "text-white",
        messageColor: "text-gray-200",
        footerColor: "text-emerald-300",
        shadowColor: "shadow-emerald-400/50",
        accentColor: "bg-emerald-400",
    },
    error: {
        icon: XCircle,
        bgColor: "bg-gray-800",
        borderColor: "border-red-400",
        iconColor: "text-red-400",
        titleColor: "text-white",
        messageColor: "text-gray-200",
        footerColor: "text-red-300",
        shadowColor: "shadow-red-400/50",
        accentColor: "bg-red-400",
    },
    warning: {
        icon: AlertTriangle,
        bgColor: "bg-gray-800",
        borderColor: "border-amber-400",
        iconColor: "text-amber-400",
        titleColor: "text-white",
        messageColor: "text-gray-200",
        footerColor: "text-amber-300",
        shadowColor: "shadow-amber-400/50",
        accentColor: "bg-amber-400",
    },
    info: {
        icon: Info,
        bgColor: "bg-gray-800",
        borderColor: "border-blue-400",
        iconColor: "text-blue-400",
        titleColor: "text-white",
        messageColor: "text-gray-200",
        footerColor: "text-blue-300",
        shadowColor: "shadow-blue-400/50",
        accentColor: "bg-blue-400",
    },
}

export const NotificationProvider = () => {
    const notifications = useNotificationStore((s) => s.notifications)
    const remove = useNotificationStore((s) => s.removeNotification)

    return (
        <div className="bottom-6 right-6 z-[1000] fixed max-w-md">
            <div className="flex flex-col gap-2 transition-all">
                {notifications.map((notification, index) => (
                    <Notification
                        key={notification.id}
                        {...notification}
                        index={index}
                        onClose={(id) => remove(id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default function Notification({
    id,
    type,
    title,
    message,
    footer,
    length,
    persistent,
    index,
    onClose,
}: NotificationProps) {
    const [remainingTime, setRemainingTime] = useState<number | null>(null)
    const [isExiting, setIsExiting] = useState(false)
    const notificationRef = useRef<HTMLDivElement>(null)

    const config = typeConfig[type]
    const IconComponent = config.icon

    const handleClose = useCallback(() => {
        setIsExiting(true)
        // Wait for exit animation to complete before removing from DOM
        setTimeout(() => {
            onClose(id)
        }, 300) // Match the exit animation duration
    }, [id, onClose])

    useEffect(() => {
        if (persistent || !length) return;

        const startTime = Date.now(); // mount time
        const duration = length;

        const updateRemainingTime = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, duration - elapsed);
            setRemainingTime(Math.ceil(remaining / 1000));
        };

        updateRemainingTime(); // initialize immediately

        const countdownInterval = setInterval(updateRemainingTime, 100);

        const hideTimer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
                onClose(id);
            }, 300);
        }, duration);

        return () => {
            clearInterval(countdownInterval);
            clearTimeout(hideTimer);
        };
    }, []);

    return (
        <div
            ref={notificationRef}
            className={`
                relative overflow-hidden w-96 mb-4
                ${config.bgColor} border-2 ${config.borderColor} rounded-lg 
                shadow-2xl ${config.shadowColor}
                ring-1 ring-white/10
                ${isExiting ? 'notification-exit' : 'notification-enter'}
            `}
            style={{
                transform: `translateY(${index * -8}px)`,
                zIndex: 1000 - index,
            }}
        >
            {/* Accent line */}
            <div
                className={`absolute top-0 left-0 right-0 h-1 ${config.accentColor} notification-accent-enter`}
            />

            {/* Main content */}
            <div className="relative p-4">
                {/* Header with icon and close button */}
                <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex flex-1 items-start gap-3 min-w-0">
                        {/* Animated icon */}
                        <div
                            className={`flex-shrink-0 ${config.iconColor} relative notification-icon-enter`}
                        >
                            <IconComponent className="w-6 h-6" />
                            {type === "success" && (
                                <div
                                    className="-top-1 -right-1 absolute notification-sparkle-enter"
                                >
                                    <Sparkles className="w-4 h-4 text-emerald-300" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div
                            className="flex-1 space-y-2 min-w-0 notification-content-enter"
                        >
                            {/* Title */}
                            {title && (
                                <div
                                    className={`text-base font-bold ${config.titleColor} leading-tight notification-title-enter`}
                                >
                                    {title}
                                </div>
                            )}

                            {/* Message */}
                            <div
                                className={`text-sm leading-relaxed ${config.messageColor} ${title ? 'notification-message-enter' : 'notification-message-enter-no-title'}`}
                            >
                                {message}
                            </div>
                        </div>
                    </div>

                    {/* Animated close button */}
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 hover:bg-white/10 p-2 rounded-md transition-colors duration-200 notification-close notification-close-enter"
                    >
                        <X className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Footer with countdown */}
                {(footer || (!persistent && remainingTime !== null)) && (
                    <div
                        className={`flex items-center gap-2 text-sm ${config.footerColor} pt-2 border-t border-white/10 notification-footer-enter`}
                    >
                        <Clock className="w-4 h-4" />
                        <span className="truncate">
                            {persistent ? (
                                footer || "Click to close"
                            ) : remainingTime !== null ? (
                                <>
                                    {footer ? `${footer} • ` : ""}
                                    <span
                                        key={Math.floor(remainingTime)}
                                        className={`${Math.ceil(remainingTime) <= 3 ? "text-red-400 font-semibold" : "font-medium"} notification-countdown-pulse`}
                                    >
                                        Auto-closes in {Math.ceil(remainingTime)}s
                                    </span>
                                </>
                            ) : (
                                footer
                            )}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}