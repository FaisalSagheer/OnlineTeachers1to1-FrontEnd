export async function POST(req) {
  const { username, email } = await req.json()
  return Response.json({ message: "User information updated successfully." })
}
