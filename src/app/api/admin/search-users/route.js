import { NextResponse } from "next/server"

// In-memory storage (same as in create-user route)
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

// GET /admin/search-users/ - Search users by username
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    let filteredUsers = users

    if (query) {
      filteredUsers = users.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Return users without sensitive information
    const safeUsers = filteredUsers.map(({ id, username, email, role, status, lastLogin }) => ({
      id,
      username,
      email,
      role,
      status,
      lastLogin,
    }))

    return NextResponse.json(safeUsers)
  } catch (error) {
    console.error("Search users error:", error)
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 })
  }
}
