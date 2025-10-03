export async function POST(req) {
  const { old_password, new_password } = await req.json()

  return Response.json({ message: "Password changed successfully!" })
}
