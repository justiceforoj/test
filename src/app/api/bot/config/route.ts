import { NextResponse } from "next/server"
import { getGuildConfig, updateGuildConfig } from "@/app/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const guildId = searchParams.get("guildId")

  if (!guildId) {
    return NextResponse.json({ error: "Guild ID is required" }, { status: 400 })
  }

  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const config = await getGuildConfig(guildId)
    return NextResponse.json(config)
  } catch (error) {
    console.error("Error fetching config:", error)
    return NextResponse.json({ error: "Failed to fetch configuration" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { guildId, config } = body

    if (!guildId || !config) {
      return NextResponse.json({ error: "Guild ID and config are required" }, { status: 400 })
    }

    const result = await updateGuildConfig(guildId, config)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating config:", error)
    return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 })
  }
}

