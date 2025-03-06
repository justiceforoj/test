import { kv } from "@vercel/kv"

// Bot stats
export async function getBotStats() {
  try {
    const stats = await kv.get("bot:stats")
    return (
      stats || {
        servers: 0,
        users: 0,
        commands: 0,
        uptime: 0,
        lastRestart: new Date().toISOString(),
      }
    )
  } catch (error) {
    console.error("Error fetching bot stats:", error)
    throw error
  }
}

export async function updateBotStats(stats: any) {
  try {
    await kv.set("bot:stats", stats)
    return { success: true }
  } catch (error) {
    console.error("Error updating bot stats:", error)
    throw error
  }
}

// Guild configuration
export async function getGuildConfig(guildId: string) {
  try {
    const config = await kv.get(`guild:${guildId}:config`)
    return (
      config || {
        prefix: "!",
        welcomeMessage: "Welcome to the server, {user}!",
        logChannel: "bot-logs",
        moderationEnabled: true,
        autoRole: "member",
      }
    )
  } catch (error) {
    console.error(`Error fetching config for guild ${guildId}:`, error)
    throw error
  }
}

export async function updateGuildConfig(guildId: string, config: any) {
  try {
    await kv.set(`guild:${guildId}:config`, config)
    return { success: true }
  } catch (error) {
    console.error(`Error updating config for guild ${guildId}:`, error)
    throw error
  }
}

// Commands usage
export async function incrementCommandUsage(commandName: string) {
  try {
    await kv.incr(`command:${commandName}:usage`)
    await kv.incr("bot:stats:commands")
    return { success: true }
  } catch (error) {
    console.error(`Error incrementing usage for command ${commandName}:`, error)
    throw error
  }
}

export async function getCommandUsage() {
  try {
    // Get all command keys
    const keys = await kv.keys("command:*:usage")

    if (keys.length === 0) return []

    // Get usage counts for all commands
    const commands = await Promise.all(
      keys.map(async (key) => {
        const commandName = key.split(":")[1]
        const count = await kv.get(key)
        return { name: commandName, count }
      }),
    )

    return commands
  } catch (error) {
    console.error("Error fetching command usage:", error)
    throw error
  }
}

// Server list
export async function updateServerList(servers: any[]) {
  try {
    await kv.set("bot:servers", servers)
    return { success: true }
  } catch (error) {
    console.error("Error updating server list:", error)
    throw error
  }
}

export async function getServerList() {
  try {
    const servers = await kv.get("bot:servers")
    return servers || []
  } catch (error) {
    console.error("Error fetching server list:", error)
    throw error
  }
}

