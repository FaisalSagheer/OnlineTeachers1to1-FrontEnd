"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, Download, Search, TrendingUp, AlertCircle, CheckCircle, Clock, Plus, X, Send } from "lucide-react"

export default function FeeManagement() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [editingPayment, setEditingPayment] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [notification, setNotification] = useState(null)

  // Payment form state
  const [paymentFormData, setPaymentFormData] = useState({
    studentName: "",
    course: "",
    amount: "",
    dueDate: "",
    status: "Pending",
    method: "",
    notes: "",
  })

  // Reminder form state
  const [reminderFormData, setReminderFormData] = useState({
    message: "",
    sendEmail: true,
    sendSMS: false,
  })

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Fetch payments from API
  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/payments")
      if (!response.ok) throw new Error("Failed to fetch payments")
      const data = await response.json()
      setPayments(data)
    } catch (error) {
      showNotification("Failed to fetch payments", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  // Calculate statistics
  const totalRevenue = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter((p) => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0)
  const overdueAmount = payments.filter((p) => p.status === "Overdue").reduce((sum, p) => sum + p.amount, 0)

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.course.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Handle payment form submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault()

    if (
      !paymentFormData.studentName ||
      !paymentFormData.course ||
      !paymentFormData.amount ||
      !paymentFormData.dueDate
    ) {
      showNotification("Please fill in all required fields", "error")
      return
    }

    try {
      const url = editingPayment ? `/api/payments/${editingPayment.id}` : "/api/payments"
      const method = editingPayment ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentFormData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save payment")
      }

      showNotification(`Payment ${editingPayment ? "updated" : "created"} successfully`)

      // Reset form and refresh payments
      setPaymentFormData({
        studentName: "",
        course: "",
        amount: "",
        dueDate: "",
        status: "Pending",
        method: "",
        notes: "",
      })
      setShowPaymentForm(false)
      setEditingPayment(null)
      fetchPayments()
    } catch (error) {
      showNotification(error.message, "error")
    }
  }

  // Handle reminder form submission
  const handleReminderSubmit = async (e) => {
    e.preventDefault()

    if (!reminderFormData.message) {
      showNotification("Please enter a reminder message", "error")
      return
    }

    try {
      const response = await fetch(`/api/payments/${selectedPayment.id}/reminder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reminderFormData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send reminder")
      }

      showNotification("Reminder sent successfully")

      // Reset form
      setReminderFormData({ message: "", sendEmail: true, sendSMS: false })
      setShowReminderForm(false)
      setSelectedPayment(null)
    } catch (error) {
      showNotification(error.message, "error")
    }
  }

  // Handle edit payment
  const handleEditPayment = (payment) => {
    setEditingPayment(payment)
    setPaymentFormData({
      studentName: payment.studentName,
      course: payment.course,
      amount: payment.amount.toString(),
      dueDate: payment.dueDate,
      status: payment.status,
      method: payment.method || "",
      notes: payment.notes || "",
    })
    setShowPaymentForm(true)
  }

  // Handle mark as paid
  const handleMarkAsPaid = async (paymentId) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/mark-paid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "Manual Entry",
          paidDate: new Date().toISOString().split("T")[0],
        }),
      })

      if (!response.ok) throw new Error("Failed to mark payment as paid")

      showNotification("Payment marked as paid successfully")
      fetchPayments()
    } catch (error) {
      showNotification("Failed to mark payment as paid", "error")
    }
  }

  // Handle process refund
  const handleProcessRefund = async (paymentId) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to process refund")

      showNotification("Refund processed successfully")
      fetchPayments()
    } catch (error) {
      showNotification("Failed to process refund", "error")
    }
  }

  // Handle send reminder
  const handleSendReminder = (payment) => {
    setSelectedPayment(payment)
    setReminderFormData({
      message: `Dear ${payment.studentName}, this is a reminder that your payment of $${payment.amount} for ${payment.course} is due on ${payment.dueDate}. Please make your payment at your earliest convenience.`,
      sendEmail: true,
      sendSMS: false,
    })
    setShowReminderForm(true)
  }

  // Handle delete payment
  const handleDeletePayment = async (paymentId) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete payment")

      showNotification("Payment deleted successfully")
      fetchPayments()
    } catch (error) {
      showNotification("Failed to delete payment", "error")
    }
  }

  // Handle export report
  const handleExportReport = () => {
    const csvContent = [
      ["Student", "Course", "Amount", "Status", "Due Date", "Paid Date", "Method"],
      ...filteredPayments.map((payment) => [
        payment.studentName,
        payment.course,
        payment.amount,
        payment.status,
        payment.dueDate,
        payment.paidDate || "",
        payment.method || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fee-report-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Cancel forms
  const handleCancelPaymentForm = () => {
    setShowPaymentForm(false)
    setEditingPayment(null)
    setPaymentFormData({
      studentName: "",
      course: "",
      amount: "",
      dueDate: "",
      status: "Pending",
      method: "",
      notes: "",
    })
  }

  const handleCancelReminderForm = () => {
    setShowReminderForm(false)
    setSelectedPayment(null)
    setReminderFormData({ message: "", sendEmail: true, sendSMS: false })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <CheckCircle size={16} color="#48bb78" />
      case "Pending":
        return <Clock size={16} color="#ed8936" />
      case "Overdue":
        return <AlertCircle size={16} color="#f56565" />
      case "Refunded":
        return <TrendingUp size={16} color="#9f7aea" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ fontSize: "1.125rem" }}>Loading payments...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Notification */}
      {notification && (
        <div
          className={`notification ${notification.type === "error" ? "notification-error" : "notification-success"}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "1rem",
            borderRadius: "8px",
            color: "white",
            backgroundColor: notification.type === "error" ? "#f56565" : "#48bb78",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Fee Management</h1>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button className="btn-secondary" onClick={handleExportReport}>
            <Download size={16} />
            Export Report
          </Button>
          <Button className="btn-primary" onClick={() => setShowPaymentForm(true)}>
            <Plus size={16} />
            Add Payment
          </Button>
        </div>
      </div>

      {/* Fee Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="stat-value">${totalRevenue.toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <CheckCircle size={40} color="#48bb78" />
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="stat-value">${pendingAmount.toLocaleString()}</div>
              <div className="stat-label">Pending Payments</div>
            </div>
            <Clock size={40} color="#ed8936" />
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="stat-value">${overdueAmount.toLocaleString()}</div>
              <div className="stat-label">Overdue Amount</div>
            </div>
            <AlertCircle size={40} color="#f56565" />
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="stat-value">{payments.length}</div>
              <div className="stat-label">Total Transactions</div>
            </div>
            <DollarSign size={40} color="#fc800a" />
          </div>
        </div>
      </div>

      {/* Add/Edit Payment Form */}
      {showPaymentForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>{editingPayment ? "Edit Payment" : "Add New Payment"}</h3>
            <Button className="btn-secondary" onClick={handleCancelPaymentForm} style={{ padding: "0.5rem" }}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handlePaymentSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentName" className="form-label">
                  Student Name *
                </label>
                <Input
                  id="studentName"
                  className="form-input"
                  value={paymentFormData.studentName}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, studentName: e.target.value })}
                  placeholder="Enter student name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="course" className="form-label">
                  Course *
                </label>
                <Input
                  id="course"
                  className="form-input"
                  value={paymentFormData.course}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, course: e.target.value })}
                  placeholder="Enter course name"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount" className="form-label">
                  Amount *
                </label>
                <Input
                  id="amount"
                  type="number"
                  className="form-input"
                  value={paymentFormData.amount}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dueDate" className="form-label">
                  Due Date *
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  className="form-input"
                  value={paymentFormData.dueDate}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  className="form-input"
                  value={paymentFormData.status}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="method" className="form-label">
                  Payment Method
                </label>
                <select
                  id="method"
                  className="form-input"
                  value={paymentFormData.method}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, method: e.target.value })}
                >
                  <option value="">Select method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Manual Entry">Manual Entry</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <Input
                  id="notes"
                  className="form-input"
                  value={paymentFormData.notes}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, notes: e.target.value })}
                  placeholder="Enter any additional notes"
                />
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit" className="btn-primary">
                <Plus size={16} />
                {editingPayment ? "Update Payment" : "Add Payment"}
              </Button>
              <Button type="button" className="btn-secondary" onClick={handleCancelPaymentForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Send Reminder Form */}
      {showReminderForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <div className="form-header">
            <h3>Send Payment Reminder</h3>
            <Button className="btn-secondary" onClick={handleCancelReminderForm} style={{ padding: "0.5rem" }}>
              <X size={16} />
            </Button>
          </div>
          <form onSubmit={handleReminderSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="message" className="form-label">
                  Reminder Message *
                </label>
                <textarea
                  id="message"
                  className="form-input"
                  value={reminderFormData.message}
                  onChange={(e) => setReminderFormData({ ...reminderFormData, message: e.target.value })}
                  placeholder="Enter reminder message"
                  rows={4}
                  required
                  style={{ resize: "vertical", minHeight: "100px" }}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Delivery Options</label>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input
                      type="checkbox"
                      checked={reminderFormData.sendEmail}
                      onChange={(e) => setReminderFormData({ ...reminderFormData, sendEmail: e.target.checked })}
                    />
                    Email
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input
                      type="checkbox"
                      checked={reminderFormData.sendSMS}
                      onChange={(e) => setReminderFormData({ ...reminderFormData, sendSMS: e.target.checked })}
                    />
                    SMS
                  </label>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit" className="btn-primary">
                <Send size={16} />
                Send Reminder
              </Button>
              <Button type="button" className="btn-secondary" onClick={handleCancelReminderForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
          <Search
            size={20}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#718096",
            }}
          />
          <Input
            placeholder="Search by student name or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "40px" }}
            className="form-input"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-input"
          style={{ width: "200px" }}
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="data-table">
        <div className="table-header">
          <h3>Payment Records ({filteredPayments.length})</h3>
        </div>
        <div className="table-content">
          {/* Table Headers */}
          <div
            className="table-row table-header-row"
            style={{
              fontWeight: "bold",
              backgroundColor: "#fef5e7",
              gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr 1fr 2fr",
            }}
          >
            <div>Student</div>
            <div>Course</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Due Date</div>
            <div>Paid Date</div>
            <div>Method</div>
            <div>Actions</div>
          </div>

          {/* Payment Rows */}
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="table-row"
              style={{
                gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr 1fr 2fr",
              }}
            >
              <div style={{ fontWeight: "600" }}>{payment.studentName}</div>
              <div style={{ color: "#718096" }}>{payment.course}</div>
              <div style={{ fontWeight: "600", color: "#fc800a" }}>${payment.amount}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {getStatusIcon(payment.status)}
                <span
                  className={`status-badge ${
                    payment.status === "Paid"
                      ? "status-active"
                      : payment.status === "Pending"
                        ? "status-pending"
                        : payment.status === "Overdue"
                          ? "status-pending"
                          : "status-completed"
                  }`}
                >
                  {payment.status}
                </span>
              </div>
              <div style={{ fontSize: "0.875rem", color: "#718096" }}>{payment.dueDate}</div>
              <div style={{ fontSize: "0.875rem", color: "#718096" }}>{payment.paidDate || "-"}</div>
              <div style={{ fontSize: "0.875rem" }}>{payment.method || "-"}</div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <Button
                  size="sm"
                  className="btn-secondary"
                  onClick={() => handleEditPayment(payment)}
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                >
                  Edit
                </Button>
                {payment.status === "Pending" && (
                  <Button
                    size="sm"
                    className="btn-primary"
                    onClick={() => handleMarkAsPaid(payment.id)}
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                  >
                    Mark Paid
                  </Button>
                )}
                {(payment.status === "Pending" || payment.status === "Overdue") && (
                  <Button
                    size="sm"
                    className="btn-secondary"
                    onClick={() => handleSendReminder(payment)}
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                  >
                    Remind
                  </Button>
                )}
                {payment.status === "Paid" && (
                  <Button
                    size="sm"
                    onClick={() => handleProcessRefund(payment.id)}
                    style={{
                      padding: "0.25rem 0.5rem",
                      backgroundColor: "#f56565",
                      color: "white",
                      border: "none",
                      fontSize: "0.75rem",
                    }}
                  >
                    Refund
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
