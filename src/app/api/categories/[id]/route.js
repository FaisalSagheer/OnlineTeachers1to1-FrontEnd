import { NextResponse } from "next/server"

// In-memory storage (same as in route.js)
const categories = [
  { id: 1, name: "Mathematics", courses: 12, color: "#fc800a", description: "Mathematical subjects and courses" },
  { id: 2, name: "Science", courses: 8, color: "#48bb78", description: "Science-related courses" },
  { id: 3, name: "Language", courses: 6, color: "#ed8936", description: "Language and literature courses" },
  { id: 4, name: "Arts", courses: 4, color: "#9f7aea", description: "Creative arts and design courses" },
]

// GET /api/categories/[id] - Fetch single category
export async function GET(request, { params }) {
  try {
    const categoryId = Number.parseInt(params.id)
    const category = categories.find((c) => c.id === categoryId)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(request, { params }) {
  try {
    const categoryId = Number.parseInt(params.id)
    const body = await request.json()
    const { name, color, description } = body

    const categoryIndex = categories.findIndex((c) => c.id === categoryId)
    if (categoryIndex === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // Check if name already exists (excluding current category)
    const existingCategory = categories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== categoryId,
    )
    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 409 })
    }

    // Update category
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      name,
      color: color || "#fc800a",
      description: description || "",
    }

    return NextResponse.json({
      message: "Category updated successfully",
      category: categories[categoryIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(request, { params }) {
  try {
    const categoryId = Number.parseInt(params.id)
    const categoryIndex = categories.findIndex((c) => c.id === categoryId)

    if (categoryIndex === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Remove category from array
    const deletedCategory = categories.splice(categoryIndex, 1)[0]

    return NextResponse.json({
      message: "Category deleted successfully",
      category: deletedCategory,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
