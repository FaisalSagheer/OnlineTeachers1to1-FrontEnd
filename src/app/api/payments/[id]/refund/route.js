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

// POST /api/payments/[id]/refund - Process refund
export async function POST(request, { params }) {
  try {
    const paymentId = Number.parseInt(params.id)

    const paymentIndex = payments.findIndex((p) => p.id === paymentId)
    if (paymentIndex === -1) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    const payment = payments[paymentIndex]
    if (payment.status !== "Paid") {
      return NextResponse.json({ error: "Only paid payments can be refunded" }, { status: 400 })
    }

    if (payment.status === "Refunded") {
      return NextResponse.json({ error: "Payment is already refunded" }, { status: 400 })
    }

    // Process refund
    payments[paymentIndex] = {
      ...payment,
      status: "Refunded",
      notes: payment.notes
        ? `${payment.notes}. Refund processed on ${new Date().toISOString().split("T")[0]}.`
        : `Refund processed on ${new Date().toISOString().split("T")[0]}.`,
    }

    return NextResponse.json({
      message: "Refund processed successfully",
      payment: payments[paymentIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process refund" }, { status: 500 })
  }
}
