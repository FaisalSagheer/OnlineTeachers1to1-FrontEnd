export async function GET(req) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) return new Response("Unauthorized", { status: 401 })
  return Response.json({
    id: 1,
    username: "johndoe",
    email: "john@example.com"
  })
}
