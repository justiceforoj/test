import { NextResponse } from "next/server"
import { getCommandUsage } from "@/app/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const commands = await getCommandUsage()
    return NextResponse.json(commands)
  } catch (error) {
    console.error("Error fetching command usage:", error)
    return NextResponse.json({ error: "Failed to fetch command usage" }, { status: 500 })
  }
}

