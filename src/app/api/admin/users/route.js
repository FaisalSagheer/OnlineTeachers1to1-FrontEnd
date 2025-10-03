// In file: src/app/api/admin/users/route.js

import { NextResponse } from "next/server";

// This should be your central database or a shared module in a real app
import { users } from "@/lib/data";

// GET /api/admin/users - Fetches all users
export async function GET() {
  try {
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}