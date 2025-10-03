import { NextResponse } from "next/server"

// In-memory storage (same as in route.js)
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

// GET /api/payments/[id] - Fetch single payment
export async function GET(request, { params }) {
  try {
    const paymentId = Number.parseInt(params.id)
    const payment = payments.find((p) => p.id === paymentId)

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 })
  }
}

// PUT /api/payments/[id] - Update payment
export async function PUT(request, { params }) {
  try {
    const paymentId = Number.parseInt(params.id)
    const body = await request.json()
    const { studentName, course, amount, dueDate, status, method, notes } = body

    const paymentIndex = payments.findIndex((p) => p.id === paymentId)
    if (paymentIndex === -1) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Validate required fields
    if (!studentName || !course || !amount || !dueDate) {
      return NextResponse.json({ error: "Student name, course, amount, and due date are required" }, { status: 400 })
    }

    // Update payment
    payments[paymentIndex] = {
      ...payments[paymentIndex],
      studentName,
      course,
      amount: Number.parseFloat(amount),
      status: status || "Pending",
      dueDate,
      method: method || null,
      notes: notes || "",
      // Update paidDate if status changed to Paid
      paidDate:
        status === "Paid" && payments[paymentIndex].status !== "Paid"
          ? new Date().toISOString().split("T")[0]
          : payments[paymentIndex].paidDate,
    }

    return NextResponse.json({
      message: "Payment updated successfully",
      payment: payments[paymentIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}

// DELETE /api/payments/[id] - Delete payment
export async function DELETE(request, { params }) {
  try {
    const paymentId = Number.parseInt(params.id)
    const paymentIndex = payments.findIndex((p) => p.id === paymentId)

    if (paymentIndex === -1) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Remove payment from array
    const deletedPayment = payments.splice(paymentIndex, 1)[0]

    return NextResponse.json({
      message: "Payment deleted successfully",
      payment: deletedPayment,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 })
  }
}
