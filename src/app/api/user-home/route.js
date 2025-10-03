import { NextResponse } from "next/server"

export async function GET(req) {
  // Renamed from GETCourse to GET
  const authHeader = req.headers.get("authorization")
  // In a real application, you would validate the token here
  if (!authHeader) {
    // For local development/testing, we might allow unauthenticated access
    // or return a more specific error if authentication is strictly required.
    console.warn("No authorization header provided for /api/user-home. Proceeding with mock data.")
    // return new Response("Unauthorized", { status: 401 }); // Uncomment for strict auth
  }

  // This is mock user home data. In a real app, this would come from a database.
  const userHomeData = {
    profile: {
      name: "John Doe",
      role: "Mathematics Teacher",
      email: "john@example.com",
    },
    courses: [
      {
        id: 1,
        name: "Mathematics",
        status: "active",
        category: "Mathematics",
        description: "A comprehensive course on advanced calculus.",
        course_pic: "/placeholder.svg?height=300&width=400",
      },
      {
        id: 2,
        name: "Science",
        status: "completed",
        category: "Science",
        description: "An introductory course to biology and chemistry.",
        course_pic: "/placeholder.svg?height=300&width=400",
      },
      {
        id: 3,
        name: "History",
        status: "active",
        category: "Humanities",
        description: "Exploring ancient civilizations and their impact.",
        course_pic: "/placeholder.svg?height=300&width=400",
      },
      {
        id: 4,
        name: "English Literature",
        status: "active",
        category: "Humanities",
        description: "Deep dive into classic English novels and poetry.",
        course_pic: "/placeholder.svg?height=300&width=400",
      },
      {
        id: 5,
        name: "Computer Science Basics",
        status: "active",
        category: "Technology",
        description: "Fundamentals of programming and algorithms.",
        course_pic: "/placeholder.svg?height=300&width=400",
      },
      {
        id: 6,
        name: "Art & Design",
        status: "completed",
        category: "Arts",
        description: "Creative expression through various art forms.",
        course_pic: "/placeholder.svg?height=300&width=400",
      },
      {
        id: 7,
        name: "Physics for Beginners",
        status: "active",
        category: "Science",
        description: "Understanding the laws of motion and energy.",
        course_pic: "/placeholder.svg?height=300&width=400",
      },
      {
        id: 8,
        name: "Advanced Algebra",
        status: "active",
        category: "Mathematics",
        description: "Solving complex algebraic equations and functions.",
        course_pic: "/placeholder.svg?height=300&width=400",
      },
    ],
    teachers: [
      { id: 101, name: "Ms. Sarah", subject: "Math" },
      { id: 102, name: "Mr. Ali", subject: "English" },
    ],
    subjects: ["Math", "English", "Science", "History", "Computer Science", "Art"],
    notifications: [
      { id: 1, message: "New assignment uploaded", date: "2025-06-19" },
      { id: 2, message: "Fee due in 3 days", date: "2025-06-21" },
    ],
    totalCount: 8, // Added totalCount for consistency with search API
  }

  return NextResponse.json(userHomeData, { status: 200 })
}
