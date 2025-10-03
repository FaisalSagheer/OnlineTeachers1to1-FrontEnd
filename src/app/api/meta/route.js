import { NextResponse } from "next/server";
// Import all the metadata from your central data file
import { subjects, curriculums, categories } from './data.js';

// GET /api/meta - Fetch all metadata
export async function GET() {
  try {
    // Return a combined object with all metadata arrays
    return NextResponse.json({
      subjects,
      curriculums,
      categories
    });
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
  }
}
