export async function GET(req) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) return new Response("Unauthorized", { status: 401 })

  return Response.json({
    role: "Parent",
    selected_courses: ["Math"],
    all_courses: ["Math", "Science"]
  })
}
