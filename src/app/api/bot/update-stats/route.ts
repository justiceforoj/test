import { NextResponse } from "next/server"
import { updateBotStats } from "@/app/lib/db"

// This is a simple API key check - in production, use a more secure method
const validateApiKey = (request: Request) => {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }

  const apiKey = authHeader.split(" ")[1]
  return apiKey === process.env.API_SECRET
}

export async function POST(request: Request) {
  // Validate API key
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const stats = await request.json()
    await updateBotStats(stats)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating bot stats:", error)
    return NextResponse.json({ error: "Failed to update bot stats" }, { status: 500 })
  }
}

