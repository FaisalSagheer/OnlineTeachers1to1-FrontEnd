// app/api/logout/route.js
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Clear the token cookie
  cookies().set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  })

  return NextResponse.json({ message: "Logout successful!" })
}
