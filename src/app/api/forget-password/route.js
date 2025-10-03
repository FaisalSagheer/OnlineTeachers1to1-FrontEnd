export async function POST(req) {
  const { email } = await req.json()
  const resetToken = Math.random().toString(36).substring(2, 15)
  console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`)
  return Response.json({ message: `Password reset link sent to ${email}. It is valid for 15 minutes.` })
}
