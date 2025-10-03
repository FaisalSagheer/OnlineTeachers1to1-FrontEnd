import { NextResponse } from "next/server"

// In-memory storage (same as other routes)
const users = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    role: "Teacher",
    status: "Active",
    lastLogin: "2024-01-15",
  },
  {
    id: 2,
    username: "sarah_johnson",
    email: "sarah@example.com",
    role: "Parent",
    status: "Active",
    lastLogin: "2024-01-14",
  },
  {
    id: 3,
    username: "mike_wilson",
    email: "mike@example.com",
    role: "Manager",
    status: "Inactive",
    lastLogin: "2024-01-10",
  },
  {
    id: 4,
    username: "emily_davis",
    email: "emily@example.com",
    role: "Teacher",
    status: "Active",
    lastLogin: "2024-01-15",
  },
]

// DELETE /admin/delete-user/[id]/ - Delete a specific user
export async function DELETE(request, { params }) {
  try {
    const userId = Number.parseInt(params.id)
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove user from array
    users.splice(userIndex, 1)

    return NextResponse.json({
      message: "User deleted successfully.",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
