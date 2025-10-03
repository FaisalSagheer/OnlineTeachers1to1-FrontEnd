import { NextResponse } from "next/server"

// In-memory storage (same as other routes)
const payments = [
  {
    id: 1,
    studentName: "Alice Johnson",
    course: "Advanced Mathematics",
    amount: 299,
    status: "Paid",
    dueDate: "2024-01-15",
    paidDate: "2024-01-14",
    method: "Credit Card",
    notes: "Payment completed on time",
  },
  {
    id: 2,
    studentName: "Bob Smith",
    course: "Physics Fundamentals",
    amount: 249,
    status: "Pending",
    dueDate: "2024-01-20",
    paidDate: null,
    method: null,
    notes: "Reminder sent",
  },
  {
    id: 3,
    studentName: "Carol Davis",
    course: "English Literature",
    amount: 199,
    status: "Overdue",
    dueDate: "2024-01-10",
    paidDate: null,
    method: null,
    notes: "Multiple reminders sent",
  },
  {
    id: 4,
    studentName: "David Wilson",
    course: "Advanced Mathematics",
    amount: 299,
    status: "Refunded",
    dueDate: "2024-01-12",
    paidDate: "2024-01-11",
    method: "Bank Transfer",
    notes: "Refund processed due to course cancellation",
  },
]

// POST /api/payments/[id]/mark-paid - Mark payment as paid
export async function POST(request, { params }) {
  try {
    const paymentId = Number.parseInt(params.id)
    const body = await request.json()
    const { method, paidDate } = body

    const paymentIndex = payments.findIndex((p) => p.id === paymentId)
    if (paymentIndex === -1) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    const payment = payments[paymentIndex]
    if (payment.status === "Paid") {
      return NextResponse.json({ error: "Payment is already marked as paid" }, { status: 400 })
    }

    // Update payment status
    payments[paymentIndex] = {
      ...payment,
      status: "Paid",
      paidDate: paidDate || new Date().toISOString().split("T")[0],
      method: method || "Manual Entry",
      notes: payment.notes ? `${payment.notes}. Marked as paid manually.` : "Marked as paid manually.",
    }

    return NextResponse.json({
      message: "Payment marked as paid successfully",
      payment: payments[paymentIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark payment as paid" }, { status: 500 })
  }
}
