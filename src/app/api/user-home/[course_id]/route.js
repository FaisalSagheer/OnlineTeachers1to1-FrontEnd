// /api/user-home/[course_id]/ - User-specific home for a given course
export async function GET(req, { params }) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) return new Response("Unauthorized", { status: 401 })

  const { course_id } = params
  return Response.json({
    courseId: course_id,
    courseName: "Math",
    teachers: ["Mr. Smith"],
    subjects: ["Algebra"]
  })
}
