import { NextResponse } from "next/server"

// In-memory storage (replace with actual database)
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

let nextPaymentId = 5

// GET /api/payments - Fetch all payments
export async function GET() {
  try {
    return NextResponse.json(payments)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

// POST /api/payments - Create new payment
export async function POST(request) {
  try {
    const body = await request.json()
    const { studentName, course, amount, dueDate, status, method, notes } = body

    // Validate required fields
    if (!studentName || !course || !amount || !dueDate) {
      return NextResponse.json({ error: "Student name, course, amount, and due date are required" }, { status: 400 })
    }

    // Create new payment
    const newPayment = {
      id: nextPaymentId++,
      studentName,
      course,
      amount: Number.parseFloat(amount),
      status: status || "Pending",
      dueDate,
      paidDate: status === "Paid" ? new Date().toISOString().split("T")[0] : null,
      method: method || null,
      notes: notes || "",
    }

    payments.push(newPayment)

    return NextResponse.json(
      {
        message: "Payment created successfully",
        payment: newPayment,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
