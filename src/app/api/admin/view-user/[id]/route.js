import { NextResponse } from "next/server"

// In-memory storage (same as other routes)
import { users } from "@/lib/data";
// GET /admin/view-user/[id]/ - View a specific user
export async function GET(request, { params }) {
  try {
    const userId = Number.parseInt(params.id)
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user without sensitive information
    const { id, username, email, role, status, lastLogin } = user
    return NextResponse.json({
      id,
      username,
      email,
      role,
      status,
      lastLogin,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
