import { NextResponse } from "next/server"

// In-memory storage (replace with actual database)
const categories = [
  { id: 1, name: "Mathematics", courses: 12, color: "#fc800a", description: "Mathematical subjects and courses" },
  { id: 2, name: "Science", courses: 8, color: "#48bb78", description: "Science-related courses" },
  { id: 3, name: "Language", courses: 6, color: "#ed8936", description: "Language and literature courses" },
  { id: 4, name: "Arts", courses: 4, color: "#9f7aea", description: "Creative arts and design courses" },
]

let nextCategoryId = 5

// GET /api/categories - Fetch all categories
export async function GET() {
  try {
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

// POST /api/categories - Create new category
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, color, description } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // Check if category name already exists
    const existingCategory = categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase())
    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 409 })
    }

    // Create new category
    const newCategory = {
      id: nextCategoryId++,
      name,
      courses: 0,
      color: color || "#fc800a",
      description: description || "",
    }

    categories.push(newCategory)

    return NextResponse.json(
      {
        message: "Category created successfully",
        category: newCategory,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
