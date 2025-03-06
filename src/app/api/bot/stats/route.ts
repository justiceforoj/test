import { NextResponse } from "next/server"
import { getBotStats } from "@/app/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await getBotStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching bot stats:", error)
    return NextResponse.json({ error: "Failed to fetch bot statistics" }, { status: 500 })
  }
}

