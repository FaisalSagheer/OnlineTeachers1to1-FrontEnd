// /api/profile/ - View user profile info
export async function GET(req) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) return new Response("Unauthorized", { status: 401 })

  return Response.json({
    id: 1,
    username: "johndoe",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "Mathematics Teacher",
    rating: 4.9,
    courses: 3,
    students: 45,
    avatarUrl: "/placeholder.svg?height=200&width=200"
  })
}
