import { NextResponse } from "next/server";
// Correctly import BOTH users and getNextId from your shared file
import { users, getNextId } from "@/lib/data";



// POST /admin/create-user/ - Create new user
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password, role, status } = body;

    // ... (Your validation logic is perfect, no changes needed) ...
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 });
    }
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return NextResponse.json({ error: "User with this username already exists" }, { status: 409 });
    }
    const existingEmail = users.find((user) => user.email === email);
    if (existingEmail) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }
    
    // Create new user using the SHARED ID function
    const newUser = {
      id: getNextId(), // Use the imported function here
      username,
      email,
      role: role || "Teacher",
      status: status || "Active",
      lastLogin: new Date().toISOString().split("T")[0],
    };

    // This now correctly pushes to the SHARED users array
    users.push(newUser);

    return NextResponse.json(
      {
        message: "User created successfully.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}