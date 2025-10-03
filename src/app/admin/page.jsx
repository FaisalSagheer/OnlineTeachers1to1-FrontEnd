"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Users,
  GraduationCap,
  DollarSign,
  UserCheck,
  TrendingUp,
  BookOpen,
  Calendar,
  Bell,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Eye,
  Plus,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  UserPlus,
  School,
  Baby,
} from "lucide-react"
import { useRouter } from "next/navigation"
import "./admin.css"

export default function AdminDashboard() {
  const router = useRouter()

  // Enhanced state management
  const [stats, setStats] = useState({
    totalTeachers: { value: 45, change: 12, trend: "up" },
    totalStudents: { value: 50, change: 8.5, trend: "up" },
    totalRevenue: { value: 12500, change: -2.3, trend: "down" },
    totalParents: { value: 100, change: 15.2, trend: "up" },
    activeTeachers: { value: 42, change: 5.1, trend: "up" },
    pendingPayments: { value: 23, change: -18.2, trend: "down" },
    newEnrollments: { value: 67, change: 22.4, trend: "up" },
    courseCompletion: { value: 89, change: 3.2, trend: "up" },
  })

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "enrollment",
      title: "New Student Enrollment",
      message: "Alice Johnson enrolled in Advanced Mathematics",
      time: "2 hours ago",
      icon: "user-plus",
      color: "#48bb78",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      message: "Fee payment of $299 from John Doe",
      time: "4 hours ago",
      icon: "dollar-sign",
      color: "#fc800a",
    },
    {
      id: 3,
      type: "teacher",
      title: "Teacher Application",
      message: "New teacher application from Sarah Wilson",
      time: "6 hours ago",
      icon: "user-check",
      color: "#9f7aea",
    },
    {
      id: 4,
      type: "course",
      title: "Course Updated",
      message: "Physics Fundamentals course content updated",
      time: "1 day ago",
      icon: "book-open",
      color: "#ed8936",
    },
  ])

  // Alert notifications state
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "destructive",
      title: "Payment Overdue",
      message: "3 students have overdue payments that require immediate attention.",
      icon: AlertTriangle,
      dismissible: true,
    },
    {
      id: 2,
      type: "default",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM.",
      icon: Info,
      dismissible: true,
    },
    {
      id: 3,
      type: "success",
      title: "Backup Completed",
      message: "Daily backup has been completed successfully.",
      icon: CheckCircle,
      dismissible: true,
    },
  ])

  const [isLoading, setIsLoading] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) => ({
        ...prevStats,
        totalStudents: {
          ...prevStats.totalStudents,
          value: prevStats.totalStudents.value + Math.floor(Math.random() * 3),
        },
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Enhanced action handlers with navigation
  const handleQuickAction = (action) => {
    setIsLoading(true)
    console.log(`Executing quick action: ${action}`)

    switch (action) {
      case "add-teacher":
        router.push("/admin/teachers")
        break
      case "add-student":
        router.push("/admin/students")
        break
      case "add-parent":
        router.push("/admin/parents")
        break
      case "manage-teachers":
        router.push("/admin/teachers")
        break
      case "manage-students":
        router.push("/admin/students")
        break
      case "manage-parents":
        router.push("/admin/parents")
        break
      case "add-course":
        // Simple course creation
        const courseName = prompt("Enter course name:")
        if (courseName) {
          const newActivity = {
            id: recentActivities.length + 1,
            type: "course",
            title: "New Course Created",
            message: `Course "${courseName}" has been created successfully`,
            time: "Just now",
            icon: "book-open",
            color: "#fc800a",
          }
          setRecentActivities([newActivity, ...recentActivities])
          // Update stats
          setStats((prev) => ({
            ...prev,
            newEnrollments: {
              ...prev.newEnrollments,
              value: prev.newEnrollments.value + 1,
            },
          }))
        }
        break
      default:
        console.log(`Action ${action} not implemented yet`)
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleRefreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      console.log("Data refreshed")
    }, 2000)
  }

  const handleExportData = () => {
    const data = {
      stats,
      activities: recentActivities,
      timestamp: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `dashboard-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Dismiss alert handler
  const handleDismissAlert = (alertId) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId))
  }

  const getActivityIcon = (iconType) => {
    const iconProps = { size: 20, color: "white" }
    switch (iconType) {
      case "user-plus":
        return <Users {...iconProps} />
      case "dollar-sign":
        return <DollarSign {...iconProps} />
      case "user-check":
        return <UserCheck {...iconProps} />
      case "book-open":
        return <BookOpen {...iconProps} />
      default:
        return <Bell {...iconProps} />
    }
  }

  const renderStatCard = (title, statKey, icon) => {
    const stat = stats[statKey]
    const IconComponent = icon
    return (
      <div className="stat-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <div className="stat-value" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {stat.value.toLocaleString()}
              {stat.trend === "up" ? <ArrowUp size={20} color="#48bb78" /> : <ArrowDown size={20} color="#f56565" />}
            </div>
            <div className="stat-label">{title}</div>
          </div>
          <IconComponent size={40} color="#fc800a" />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontSize: "0.875rem",
              color: stat.trend === "up" ? "#48bb78" : "#f56565",
              fontWeight: "600",
            }}
          >
            {stat.trend === "up" ? "+" : ""}
            {stat.change}%
          </span>
          <div className="progress-bar" style={{ width: "60px" }}>
            <div className="progress-fill" style={{ width: `${Math.abs(stat.change) * 2}%` }}></div>
          </div>
        </div>
      </div>
    )
  }

  const getAlertVariant = (type) => {
    switch (type) {
      case "destructive":
        return "destructive"
      case "success":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <div className="admin-dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">🏫 Admin Dashboard</h1>
          <p style={{ color: "#718096", marginTop: "0.5rem" }}>
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Button className="btn-secondary" onClick={handleRefreshData} disabled={isLoading}>
            {isLoading ? <div className="loading-spinner" /> : <RefreshCw size={16} />}
            Refresh
          </Button>
          <Button className="btn-primary" onClick={handleExportData}>
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Alert Notifications */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {alerts.map((alert) => (
            <Alert key={alert.id} variant={getAlertVariant(alert.type)}>
              <alert.icon className="h-4 w-4" />
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}
              >
                <div>
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>{alert.message}</AlertDescription>
                </div>
                {alert.dismissible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismissAlert(alert.id)}
                    style={{
                      padding: "0.25rem",
                      height: "auto",
                      minWidth: "auto",
                    }}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Enhanced Statistics Grid */}
      <div className="stats-grid">
        {renderStatCard("Total Teachers", "totalTeachers", Users)}
        {renderStatCard("Total Students", "totalStudents", GraduationCap)}
        {renderStatCard("Total Revenue", "totalRevenue", DollarSign)}
        {renderStatCard("Total Parents", "totalParents", UserCheck)}
        {renderStatCard("Active Teachers", "activeTeachers", TrendingUp)}
        {renderStatCard("Pending Payments", "pendingPayments", AlertTriangle)}
        {renderStatCard("New Enrollments", "newEnrollments", Plus)}
        {renderStatCard("Course Completion", "courseCompletion", BookOpen)}
      </div>

      {/* Management Quick Actions Grid */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#fc800a", fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
          📋 Management Modules
        </h2>
        <div className="quick-actions" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div className="action-card" onClick={() => handleQuickAction("manage-teachers")}>
            <Users size={32} color="#fc800a" />
            <h3>👨‍🏫 Teacher Management</h3>
            <p>Manage teacher profiles, assignments, and performance</p>
            <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#718096" }}>
              {stats.totalTeachers.value} teachers • {stats.activeTeachers.value} active
            </div>
          </div>
          <div className="action-card" onClick={() => handleQuickAction("manage-students")}>
            <GraduationCap size={32} color="#fc800a" />
            <h3>🎓 Student Management</h3>
            <p>Handle student enrollment, records, and progress tracking</p>
            <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#718096" }}>
              {stats.totalStudents.value} students • {stats.newEnrollments.value} new this month
            </div>
          </div>
          <div className="action-card" onClick={() => handleQuickAction("manage-parents")}>
            <UserCheck size={32} color="#fc800a" />
            <h3>👪 Parent Management</h3>
            <p>Manage parent profiles, communications, and relationships</p>
            <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#718096" }}>
              {stats.totalParents.value} parents • Active communication
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#fc800a", fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
          ⚡ Quick Actions
        </h2>
        <div className="quick-actions">
          <div className="action-card" onClick={() => handleQuickAction("add-teacher")}>
            <UserPlus size={32} color="#fc800a" />
            <h3>Add New Teacher</h3>
            <p>Register and onboard teachers</p>
          </div>
          <div className="action-card" onClick={() => handleQuickAction("add-student")}>
            <School size={32} color="#fc800a" />
            <h3>Add New Student</h3>
            <p>Enroll new students</p>
          </div>
          <div className="action-card" onClick={() => handleQuickAction("add-parent")}>
            <Baby size={32} color="#fc800a" />
            <h3>Add New Parent</h3>
            <p>Register parent profiles</p>
          </div>
          <div className="action-card" onClick={() => handleQuickAction("add-course")}>
            <BookOpen size={32} color="#fc800a" />
            <h3>Create Course</h3>
            <p>Add new course content</p>
          </div>
          <div className="action-card" onClick={() => handleQuickAction("view-payments")}>
            <DollarSign size={32} color="#fc800a" />
            <h3>View Payments</h3>
            <p>Check recent transactions</p>
          </div>
          <div className="action-card" onClick={() => handleQuickAction("analytics")}>
            <TrendingUp size={32} color="#fc800a" />
            <h3>Analytics</h3>
            <p>View detailed reports</p>
          </div>
          <div className="action-card" onClick={() => handleQuickAction("schedule")}>
            <Calendar size={32} color="#fc800a" />
            <h3>Schedule</h3>
            <p>Manage class schedules</p>
          </div>
          <div className="action-card" onClick={() => handleQuickAction("reports")}>
            <Download size={32} color="#fc800a" />
            <h3>Reports</h3>
            <p>Generate reports</p>
          </div>
        </div>
      </div>

      {/* Dashboard Grid Layout */}
      <div className="dashboard-grid">
        {/* Recent Activities */}
        <div className="chart-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ color: "#fc800a", fontSize: "1.25rem", fontWeight: "600" }}>📈 Recent Activities</h3>
            <Button className="btn-secondary" style={{ padding: "0.5rem" }}>
              <Eye size={16} />
            </Button>
          </div>
          <div className="activity-feed">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: activity.color }}>
                  {getActivityIcon(activity.icon)}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-description">{activity.message}</div>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="chart-container">
          <h3
            style={{
              color: "#fc800a",
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1.5rem",
            }}
          >
            📊 Quick Overview
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fef5e7",
                borderRadius: "8px",
                border: "1px solid #fc800a",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600" }}>Today's Enrollments</span>
                <span style={{ color: "#fc800a", fontWeight: "700" }}>12</span>
              </div>
            </div>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f0fff4",
                borderRadius: "8px",
                border: "1px solid #48bb78",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600" }}>Payments Today</span>
                <span style={{ color: "#48bb78", fontWeight: "700" }}>$2,450</span>
              </div>
            </div>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fff5f5",
                borderRadius: "8px",
                border: "1px solid #f56565",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600" }}>Pending Issues</span>
                <span style={{ color: "#f56565", fontWeight: "700" }}>3</span>
              </div>
            </div>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f7fafc",
                borderRadius: "8px",
                border: "1px solid #718096",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600" }}>Active Sessions</span>
                <span style={{ color: "#718096", fontWeight: "700" }}>156</span>
              </div>
            </div>
          </div>
          <Button
            className="btn-primary"
            style={{ width: "100%", marginTop: "1.5rem" }}
            onClick={() => handleQuickAction("detailed-analytics")}
          >
            <TrendingUp size={16} />
            View Detailed Analytics
          </Button>
        </div>
      </div>
    </div>
  )
}
