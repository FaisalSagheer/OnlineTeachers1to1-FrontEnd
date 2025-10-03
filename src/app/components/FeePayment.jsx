"use client"
import { useState, useEffect } from "react"
import {
  CreditCard,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  DollarSign,
  FileText,
  X,
  Loader2,
  RefreshCw,
  Mail,
} from "lucide-react"
import "../parent/Feepayment/FeePayment.css"

// Utility functions
const formatCardNumber = (value) =>
  value
    .replace(/\s+/g, "")
    .replace(/[^0-9]/gi, "")
    .replace(/(.{4})/g, "$1 ")
    .trim()

const formatExpiryDate = (value) =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .substr(0, 5)

// Notification Component
const Notification = ({ notification, onClose }) => (
  <div className={`notification notification-${notification.type}`}>
    <div className="notification-content">
      <span>{notification.message}</span>
      <button className="notification-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  </div>
)

// Overview Card Component
const OverviewCard = ({ title, amount, subtitle, icon: Icon, variant = "default" }) => (
  <div className="overview-card">
    <div className="overview-card-header">
      <h3 className="overview-card-title">{title}</h3>
      <Icon className={`overview-card-icon overview-card-icon-${variant}`} />
    </div>
    <div className="overview-card-content">
      <div className={`overview-card-amount overview-card-amount-${variant}`}>${amount}</div>
      <p className="overview-card-subtitle">{subtitle}</p>
    </div>
  </div>
)

// Invoice Card Component
const InvoiceCard = ({ invoice, onPay, onDownload, onView, onRemind, isPaid = false }) => (
  <div
    className={`invoice-card ${isPaid ? "invoice-card-paid" : invoice.status === "overdue" ? "invoice-card-overdue" : ""}`}
  >
    <div className="invoice-card-header">
      <div className="invoice-card-info">
        <h4 className="invoice-card-title">{invoice.description}</h4>
        <p className="invoice-card-id">{invoice.id}</p>
      </div>
      <div className={`status-badge status-badge-${invoice.status}`}>
        {invoice.status === "overdue" && <AlertCircle className="status-icon" />}
        {invoice.status === "pending" && <Clock className="status-icon" />}
        {invoice.status === "paid" && <CheckCircle className="status-icon" />}
        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
      </div>
    </div>

    <div className="invoice-card-content">
      <div className="invoice-details">
        <div className="invoice-detail-row">
          <span>Amount:</span>
          <span className="invoice-amount">${invoice.amount}</span>
        </div>
        <div className="invoice-detail-row">
          <span>{isPaid ? "Paid Date:" : "Due Date:"}</span>
          <span>{new Date(isPaid ? invoice.paidDate : invoice.dueDate).toLocaleDateString()}</span>
        </div>
        {isPaid && (
          <div className="invoice-detail-row">
            <span>Payment Method:</span>
            <span className="payment-method">{invoice.paymentMethod}</span>
          </div>
        )}
        {invoice.status === "overdue" && (
          <div className="invoice-detail-row overdue-info">
            <span>Days Overdue:</span>
            <span>{Math.floor((new Date() - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24))}</span>
          </div>
        )}
      </div>

      <div className="invoice-actions">
        {!isPaid ? (
          invoice.canPay ? (
            <button className="btn btn-primary" onClick={() => onPay(invoice)}>
              <CreditCard className="btn-icon" />
              Pay Now
            </button>
          ) : (
            <div className="payment-disabled">
              <AlertCircle className="payment-disabled-icon" />
              <span>{invoice.reason}</span>
            </div>
          )
        ) : (
          <>
            <button className="btn btn-secondary" onClick={() => onDownload(invoice)}>
              <Download className="btn-icon" />
              Download
            </button>
            <button className="btn btn-secondary" onClick={() => onView(invoice)}>
              <Eye className="btn-icon" />
              View
            </button>
          </>
        )}
        {!isPaid && (
          <button className="btn btn-icon-only" onClick={() => onRemind(invoice)}>
            <Mail className="btn-icon" />
          </button>
        )}
      </div>
    </div>
  </div>
)

// Payment Modal Component
const PaymentModal = ({ invoice, isOpen, onClose, onSubmit, isProcessing }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Payment Details</h3>
          <button className="modal-close" onClick={onClose} disabled={isProcessing}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="payment-summary">
            <h4 className="payment-summary-title">{invoice?.description}</h4>
            <p>Amount: ${invoice?.amount}</p>
            <p className="payment-summary-id">Invoice ID: {invoice?.id}</p>
          </div>

          <div className="payment-form">
            <div className="form-group">
              <label className="form-label" htmlFor="cardholderName">
                Cardholder Name
              </label>
              <input
                className="form-input"
                id="cardholderName"
                value={paymentData.cardholderName}
                onChange={(e) => setPaymentData((prev) => ({ ...prev, cardholderName: e.target.value }))}
                placeholder="John Doe"
                disabled={isProcessing}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cardNumber">
                Card Number
              </label>
              <input
                className="form-input"
                id="cardNumber"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData((prev) => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                disabled={isProcessing}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="expiryDate">
                  Expiry Date
                </label>
                <input
                  className="form-input"
                  id="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={(e) =>
                    setPaymentData((prev) => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))
                  }
                  placeholder="MM/YY"
                  maxLength={5}
                  disabled={isProcessing}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cvv">
                  CVV
                </label>
                <input
                  className="form-input"
                  id="cvv"
                  value={paymentData.cvv}
                  onChange={(e) =>
                    setPaymentData((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, "").substr(0, 3) }))
                  }
                  placeholder="123"
                  maxLength={3}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onSubmit(paymentData)}
            disabled={isProcessing || !Object.values(paymentData).every((v) => v)}
          >
            {isProcessing ? (
              <>
                <Loader2 className="btn-icon spinning" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="btn-icon" />
                Pay ${invoice?.amount}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Component
export default function FeePayment() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [demoApproved, setDemoApproved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [invoices, setInvoices] = useState({
    pending: [
      {
        id: "INV-2024-001",
        description: "Registration Fee",
        amount: 500,
        dueDate: "2024-06-15",
        status: "pending",
        type: "registration",
        canPay: false,
        reason: "Demo approval pending",
      },
      {
        id: "INV-2024-002",
        description: "Monthly Fee - June 2024",
        amount: 350,
        dueDate: "2024-06-01",
        status: "overdue",
        type: "monthly",
        canPay: true,
      },
    ],
    paid: [
      {
        id: "INV-2024-003",
        description: "Monthly Fee - May 2024",
        amount: 350,
        paidDate: "2024-05-01",
        status: "paid",
        type: "monthly",
        paymentMethod: "Credit Card ending in 4532",
        transactionId: "TXN-2024-003",
      },
    ],
  })

  const addNotification = (message, type = "info") => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 5000)
  }

  const handlePayment = (invoice) => {
    setSelectedInvoice(invoice)
    setShowPaymentModal(true)
  }

  const processPayment = async (paymentData) => {
    setIsProcessingPayment(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const paidInvoice = {
        ...selectedInvoice,
        status: "paid",
        paidDate: new Date().toISOString(),
        paymentMethod: `Credit Card ending in ${paymentData.cardNumber.slice(-4)}`,
        transactionId: `TXN-${Date.now()}`,
      }

      setInvoices((prev) => ({
        pending: prev.pending.filter((inv) => inv.id !== selectedInvoice.id),
        paid: [paidInvoice, ...prev.paid],
      }))

      setShowPaymentModal(false)
      addNotification(`Payment of $${selectedInvoice.amount} processed successfully!`, "success")
    } catch (error) {
      addNotification("Payment failed. Please try again.", "error")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const downloadReceipt = (invoice) => {
    const receiptData = JSON.stringify(
      {
        invoiceId: invoice.id,
        amount: invoice.amount,
        description: invoice.description,
        paidDate: invoice.paidDate,
        paymentMethod: invoice.paymentMethod,
        transactionId: invoice.transactionId,
      },
      null,
      2,
    )

    const element = document.createElement("a")
    const file = new Blob([receiptData], { type: "application/json" })
    element.href = URL.createObjectURL(file)
    element.download = `receipt-${invoice.id}.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    addNotification("Receipt downloaded successfully!", "success")
  }

  const sendReminder = async (invoice) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    addNotification(`Payment reminder sent for ${invoice.description}`, "success")
  }

  const refreshData = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    addNotification("Data refreshed successfully!", "success")
    setIsLoading(false)
  }

  useEffect(() => {
    if (demoApproved) {
      setInvoices((prev) => ({
        ...prev,
        pending: prev.pending.map((invoice) =>
          invoice.type === "registration" ? { ...invoice, canPay: true, reason: null } : invoice,
        ),
      }))
      addNotification("Demo approved! Registration fee payment is now available.", "success")
    }
  }, [demoApproved])

  const totalOutstanding = invoices.pending.reduce((sum, inv) => sum + inv.amount, 0)
  const totalPaid = invoices.paid.reduce((sum, inv) => sum + inv.amount, 0)
  const overdueAmount = invoices.pending
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0)

  const tabs = [
    { id: "overview", label: "Overview", icon: DollarSign },
    { id: "invoices", label: `Invoices (${invoices.pending.length})`, icon: FileText },
    { id: "monthly", label: "Monthly Payments", icon: Calendar },
  ]

  return (
    <div className="fee-payment-container">
      {/* Notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))}
        />
      ))}

      {/* Header */}
      <div className="header">
        <button className="btn btn-secondary" onClick={refreshData} disabled={isLoading}>
          <RefreshCw className={`btn-icon ${isLoading ? "spinning" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Demo Alert */}
      {!demoApproved && (
        <div className="alert">
          <AlertCircle className="alert-icon" />
          <div className="alert-content">
            Your demo session is pending approval. Registration fee payment will be available after demo approval.
            <button className="btn btn-small" onClick={() => setDemoApproved(true)}>
              Simulate Demo Approval
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "tab-button-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="tab-icon" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="tab-content">
          <div className="overview-grid">
            <OverviewCard
              title="Total Outstanding"
              amount={totalOutstanding}
              subtitle={`${invoices.pending.length} pending invoices`}
              icon={DollarSign}
              variant="danger"
            />
            <OverviewCard
              title="Overdue Amount"
              amount={overdueAmount}
              subtitle="Requires immediate attention"
              icon={AlertCircle}
              variant="warning"
            />
            <OverviewCard
              title="Total Paid"
              amount={totalPaid}
              subtitle={`${invoices.paid.length} payments made`}
              icon={CheckCircle}
              variant="success"
            />
          </div>

          <div className="quick-actions-card">
            <div className="quick-actions-header">
              <h3 className="quick-actions-title">Quick Actions</h3>
            </div>
            <div className="quick-actions-content">
              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const firstPayableInvoice = invoices.pending.find((inv) => inv.canPay)
                    if (firstPayableInvoice) handlePayment(firstPayableInvoice)
                  }}
                  disabled={!invoices.pending.some((inv) => inv.canPay)}
                >
                  <CreditCard className="btn-icon" />
                  Pay Outstanding Fees
                </button>
                <button className="btn btn-secondary" onClick={() => invoices.paid.forEach(downloadReceipt)}>
                  <Receipt className="btn-icon" />
                  Download All Receipts
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => invoices.pending.filter((inv) => inv.status === "overdue").forEach(sendReminder)}
                >
                  <Mail className="btn-icon" />
                  Send Reminders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div className="tab-content">
          {/* Pending Invoices */}
          <div className="invoice-section">
            <h3 className="section-title">Pending Invoices ({invoices.pending.length})</h3>
            <div className="invoice-grid">
              {invoices.pending.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} onPay={handlePayment} onRemind={sendReminder} />
              ))}
            </div>
          </div>

          {/* Paid Invoices */}
          <div className="invoice-section">
            <h3 className="section-title">Paid Invoices ({invoices.paid.length})</h3>
            <div className="invoice-grid">
              {invoices.paid.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onDownload={downloadReceipt}
                  onView={() => {}}
                  isPaid={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Payments Tab */}
      {activeTab === "monthly" && (
        <div className="tab-content">
          <div className="monthly-section">
            <h3 className="section-title">Monthly Payment Schedule</h3>
            <div className="monthly-grid">
              {[
                { month: "June 2024", amount: 350, dueDate: "2024-06-01", status: "overdue", daysOverdue: 26 },
                { month: "July 2024", amount: 350, dueDate: "2024-07-01", status: "upcoming", daysUntilDue: 4 },
                { month: "August 2024", amount: 350, dueDate: "2024-08-01", status: "upcoming", daysUntilDue: 35 },
              ].map((payment, index) => (
                <div key={index} className={`monthly-card monthly-card-${payment.status}`}>
                  <div className="monthly-card-header">
                    <h4 className="monthly-card-title">{payment.month}</h4>
                    <div className={`status-badge status-badge-${payment.status}`}>
                      {payment.status === "overdue" && <AlertCircle className="status-icon" />}
                      {payment.status === "upcoming" && <Calendar className="status-icon" />}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </div>
                  </div>

                  <div className="monthly-card-content">
                    <div className="monthly-amount">${payment.amount}</div>
                    <div className="monthly-details">
                      <div className="monthly-detail-row">
                        <span>Due Date:</span>
                        <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
                      </div>
                      {payment.status === "overdue" && (
                        <div className="monthly-detail-row overdue-info">
                          <span>Overdue by:</span>
                          <span>{payment.daysOverdue} days</span>
                        </div>
                      )}
                      {payment.status === "upcoming" && (
                        <div className="monthly-detail-row upcoming-info">
                          <span>Due in:</span>
                          <span>{payment.daysUntilDue} days</span>
                        </div>
                      )}
                    </div>

                    <div className="monthly-actions">
                      {payment.status === "overdue" && (
                        <button
                          className="btn btn-primary btn-full-width"
                          onClick={() =>
                            handlePayment({
                              id: `MP-${index}`,
                              description: `Monthly Fee - ${payment.month}`,
                              amount: payment.amount,
                              dueDate: payment.dueDate,
                              status: payment.status,
                              type: "monthly",
                              canPay: true,
                            })
                          }
                        >
                          <CreditCard className="btn-icon" />
                          Pay Now
                        </button>
                      )}
                      {payment.status === "upcoming" && (
                        <button
                          className="btn btn-secondary btn-full-width"
                          onClick={() =>
                            handlePayment({
                              id: `MP-${index}`,
                              description: `Monthly Fee - ${payment.month}`,
                              amount: payment.amount,
                              dueDate: payment.dueDate,
                              status: payment.status,
                              type: "monthly",
                              canPay: true,
                            })
                          }
                        >
                          <CreditCard className="btn-icon" />
                          Pay Early
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        invoice={selectedInvoice}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={processPayment}
        isProcessing={isProcessingPayment}
      />
    </div>
  )
}
