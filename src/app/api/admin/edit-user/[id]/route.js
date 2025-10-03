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

// PUT /admin/edit-user/[id]/ - Edit a specific user
export async function PUT(request, { params }) {
  try {
    const userId = Number.parseInt(params.id)
    const body = await request.json()
    const { username, email, password } = body

    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Validate required fields
    if (!username || !email) {
      return NextResponse.json({ error: "Username and email are required" }, { status: 400 })
    }

    // Check if username already exists (excluding current user)
    const existingUser = users.find((user) => user.username === username && user.id !== userId)
    if (existingUser) {
      return NextResponse.json({ error: "User with this username already exists" }, { status: 409 })
    }

    // Check if email already exists (excluding current user)
    const existingEmail = users.find((user) => user.email === email && user.id !== userId)
    if (existingEmail) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Update user (password is optional for updates)
    users[userIndex] = {
      ...users[userIndex],
      username,
      email,
      // Only update password if provided
      ...(password && { password }),
    }

    return NextResponse.json({
      message: "User updated successfully.",
      user: {
        id: users[userIndex].id,
        username: users[userIndex].username,
        email: users[userIndex].email,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
