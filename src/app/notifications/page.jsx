"use client";
import { useState } from "react";
import { Bell, Calendar, DollarSign, BookOpen, Check, Filter, Search, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "./notification.css";

// Mock data for notifications
const mockNotifications = [
    {
        id: 1,
        type: "demo",
        title: "Demo Class Scheduled",
        message: "Your demo class for Mathematics is scheduled for tomorrow at 3:00 PM",
        timestamp: "2024-01-15T10:30:00Z",
        isRead: false,
        priority: "high",
        studentName: "John Doe",
        subject: "Mathematics",
    },
    {
        id: 2,
        type: "fee",
        title: "Fee Payment Reminder",
        message: "Monthly fee payment of $150 is due in 3 days",
        timestamp: "2024-01-14T14:20:00Z",
        isRead: false,
        priority: "medium",
        amount: "$150",
        dueDate: "2024-01-18",
    },
    {
        id: 3,
        type: "class",
        title: "Class Rescheduled",
        message: "Your Physics class has been moved from 2:00 PM to 4:00 PM today",
        timestamp: "2024-01-14T09:15:00Z",
        isRead: true,
        priority: "high",
        subject: "Physics",
        newTime: "4:00 PM",
    },
    {
        id: 4,
        type: "demo",
        title: "Demo Class Confirmation Required",
        message: "Please confirm your attendance for the Chemistry demo class",
        timestamp: "2024-01-13T16:45:00Z",
        isRead: false,
        priority: "medium",
        studentName: "Sarah Smith",
        subject: "Chemistry",
    },
    {
        id: 5,
        type: "fee",
        title: "Payment Successful",
        message: "Your payment of $150 has been processed successfully",
        timestamp: "2024-01-12T11:30:00Z",
        isRead: true,
        priority: "low",
        amount: "$150",
    },
    {
        id: 6,
        type: "class",
        title: "New Class Added",
        message: "A new English Literature class has been added to your schedule",
        timestamp: "2024-01-11T13:20:00Z",
        isRead: false,
        priority: "medium",
        subject: "English Literature",
    },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    // Filter notifications based on active tab and search term
    const filteredNotifications = notifications.filter((notification) => {
        const matchesTab = activeTab === "all" || notification.type === activeTab;
        const matchesSearch =
            notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Sort notifications
    const sortedNotifications = [...filteredNotifications].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.timestamp) - new Date(a.timestamp);
        } else if (sortBy === "oldest") {
            return new Date(a.timestamp) - new Date(b.timestamp);
        } else if (sortBy === "unread") {
            return a.isRead - b.isRead;
        }
        return 0;
    });

    // Mark notification as read/unread
    const toggleReadStatus = (id) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? { ...notification, isRead: !notification.isRead }
                    : notification,
            ),
        );
    };

    // Delete notification
    const deleteNotification = (id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    // Mark all as read
    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case "demo":
                return <Calendar className="icon-demo h-5 w-5" />;
            case "fee":
                return <DollarSign className="icon-fee h-5 w-5" />;
            case "class":
                return <BookOpen className="icon-class h-5 w-5" />;
            default:
                return <Bell className="icon-default h-5 w-5" />;
        }
    };

    // Get priority badge color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return "priority-high";
            case "medium":
                return "priority-medium";
            case "low":
                return "priority-low";
            default:
                return "priority-medium";
        }
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return "Just now";
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    // Get unread count
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="notifications-container">
            <div className="notifications-wrapper">
                {/* Header */}
                <div className="notifications-header">
                    <div className="notifications-header-left">
                        <Bell className="h-8 w-8 text-gray-700" />
                        <div>
                            <h1 className="notifications-title">Notifications</h1>
                            <p className="notifications-subtitle">
                                Stay updated with your classes, payments, and schedules
                            </p>
                        </div>
                    </div>
                    <div className="notifications-header-right">
                        <span className="badge-primary">{unreadCount} unread</span>
                        <button onClick={markAllAsRead} className="btn-primary">
                            <Check className="h-4 w-4" />
                            Mark all read
                        </button>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="search-filter-container">
                    <div className="search-filter-bar">
                        <div className="search-container">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="btn-outline">
                                    <Filter className="h-4 w-4" />
                                    Sort by: {sortBy}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="dropdown-content">
                                <div className="dropdown-label">Sort Options</div>
                                <div className="dropdown-separator"></div>
                                <button
                                    className="dropdown-item"
                                    onClick={() => setSortBy("newest")}
                                >
                                    Newest First
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => setSortBy("oldest")}
                                >
                                    Oldest First
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => setSortBy("unread")}
                                >
                                    Unread First
                                </button>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Notification Tabs */}
                <div className="tabs-container">
                    <div className="tabs-list">
                        <button
                            className={`tab-trigger ${activeTab === "all" ? "active" : ""}`}
                            onClick={() => setActiveTab("all")}
                            data-state={activeTab === "all" ? "active" : "inactive"}
                        >
                            All
                        </button>
                        <button
                            className={`tab-trigger ${activeTab === "demo" ? "active" : ""}`}
                            onClick={() => setActiveTab("demo")}
                            data-state={activeTab === "demo" ? "active" : "inactive"}
                        >
                            Demo Classes
                        </button>
                        <button
                            className={`tab-trigger ${activeTab === "fee" ? "active" : ""}`}
                            onClick={() => setActiveTab("fee")}
                            data-state={activeTab === "fee" ? "active" : "inactive"}
                        >
                            Fee Reminders
                        </button>
                        <button
                            className={`tab-trigger ${activeTab === "class" ? "active" : ""}`}
                            onClick={() => setActiveTab("class")}
                            data-state={activeTab === "class" ? "active" : "inactive"}
                        >
                            Class Changes
                        </button>
                    </div>
                    {/* Summary Cards */}
                    <div className="summary-cards">
                        <div className="summary-card">
                            <div className="summary-card-header">
                                <Calendar className="icon-demo h-4 w-4" />
                                <h3 className="summary-card-title">Demo Classes</h3>
                            </div>
                            <div className="summary-card-number">
                                {notifications.filter((n) => n.type === "demo").length}
                            </div>
                            <p className="summary-card-subtitle">
                                {notifications.filter((n) => n.type === "demo" && !n.isRead).length}{" "}
                                unread
                            </p>
                        </div>

                        <div className="summary-card">
                            <div className="summary-card-header">
                                <DollarSign className="icon-fee h-4 w-4" />
                                <h3 className="summary-card-title">Fee Reminders</h3>
                            </div>
                            <div className="summary-card-number">
                                {notifications.filter((n) => n.type === "fee").length}
                            </div>
                            <p className="summary-card-subtitle">
                                {notifications.filter((n) => n.type === "fee" && !n.isRead).length}{" "}
                                unread
                            </p>
                        </div>

                        <div className="summary-card">
                            <div className="summary-card-header">
                                <BookOpen className="icon-class h-4 w-4" />
                                <h3 className="summary-card-title">Class Changes</h3>
                            </div>
                            <div className="summary-card-number">
                                {notifications.filter((n) => n.type === "class").length}
                            </div>
                            <p className="summary-card-subtitle">
                                {
                                    notifications.filter((n) => n.type === "class" && !n.isRead)
                                        .length
                                }{" "}
                                unread
                            </p>
                        </div>
                    </div>
                    <div className="notifications-scroll">
                        <div className="notifications-list">
                            {sortedNotifications.length === 0 ? (
                                <div className="notification-card">
                                    <div className="empty-state">
                                        <Bell className="empty-state-icon" />
                                        <h3 className="empty-state-title">
                                            No notifications found
                                        </h3>
                                        <p className="empty-state-description">
                                            {searchTerm
                                                ? "Try adjusting your search terms"
                                                : "You're all caught up!"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                sortedNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`notification-card ${!notification.isRead ? "notification-unread" : ""}`}
                                    >
                                        <div className="notification-content">
                                            <div className="notification-icon-container">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="notification-body">
                                                <div className="notification-header">
                                                    <h3 className="notification-title">
                                                        {notification.title}
                                                    </h3>
                                                    <span
                                                        className={getPriorityColor(
                                                            notification.priority,
                                                        )}
                                                    >
                                                        {notification.priority}
                                                    </span>
                                                    {!notification.isRead && (
                                                        <div className="notification-dot" />
                                                    )}
                                                </div>
                                                <p className="notification-message">
                                                    {notification.message}
                                                </p>
                                                <div className="notification-meta">
                                                    <span>
                                                        {formatTimestamp(notification.timestamp)}
                                                    </span>
                                                    {notification.studentName && (
                                                        <span>
                                                            Student: {notification.studentName}
                                                        </span>
                                                    )}
                                                    {notification.subject && (
                                                        <span>Subject: {notification.subject}</span>
                                                    )}
                                                    {notification.amount && (
                                                        <span>Amount: {notification.amount}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="notification-actions">
                                                <button
                                                    onClick={() =>
                                                        toggleReadStatus(notification.id)
                                                    }
                                                >
                                                    {notification.isRead ? (
                                                        <Bell className="h-4 w-4" />
                                                    ) : (
                                                        <Check className="h-4 w-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteNotification(notification.id)
                                                    }
                                                    className="btn-delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
