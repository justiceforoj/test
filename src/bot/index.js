// Discord bot using Discord.js
import { Client, Events, GatewayIntentBits, Collection } from "discord.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import fetch from "node-fetch"

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
})

// Command collection
client.commands = new Collection()

// Dashboard URL
const DASHBOARD_URL = process.env.DASHBOARD_URL || "http://localhost:3000"

// Bot stats
const stats = {
  servers: 0,
  users: 0,
  commands: 0,
  uptime: 0,
  lastRestart: new Date().toISOString(),
}

// Update stats every minute
setInterval(updateStats, 60000)

// Load commands
const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  import(filePath).then((command) => {
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command.default && "execute" in command.default) {
      client.commands.set(command.default.data.name, command.default)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  })
}

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
  updateStats()
  updateServerList()
})

// Handle interactions (slash commands)
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)

    // Increment command usage
    stats.commands++
    incrementCommandUsage(interaction.commandName)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true })
    } else {
      await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true })
    }
  }
})

// Handle message events for custom prefix commands
client.on(Events.MessageCreate, async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return

  // Get the guild ID
  const guildId = message.guild?.id
  if (!guildId) return

  // Get the prefix from configuration
  const prefix = await getGuildPrefix(guildId)

  // Check if message starts with the prefix
  if (!message.content.startsWith(prefix)) return

  // Parse the command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()

  // Example of a simple ping command
  if (commandName === "ping") {
    message.reply("Pong!")
    stats.commands++
    incrementCommandUsage("ping")
  }
})

// Handle guild join events
client.on(Events.GuildCreate, async (guild) => {
  console.log(`Joined a new guild: ${guild.name}`)
  updateStats()
  updateServerList()
})

// Handle guild leave events
client.on(Events.GuildDelete, async (guild) => {
  console.log(`Left a guild: ${guild.name}`)
  updateStats()
  updateServerList()
})

// Update bot stats
async function updateStats() {
  stats.servers = client.guilds.cache.size
  stats.users = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
  stats.uptime = Math.floor(client.uptime / 1000)

  try {
    const response = await fetch(`${DASHBOARD_URL}/api/bot/update-stats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_SECRET}`,
      },
      body: JSON.stringify(stats),
    })

    if (!response.ok) {
      console.error("Failed to update stats:", await response.text())
    }
  } catch (error) {
    console.error("Error updating stats:", error)
  }
}

// Update server list
async function updateServerList() {
  const servers = client.guilds.cache.map((guild) => ({
    id: guild.id,
    name: guild.name,
    memberCount: guild.memberCount,
    icon: guild.iconURL(),
    joined: guild.joinedAt,
  }))

  try {
    const response = await fetch(`${DASHBOARD_URL}/api/bot/update-servers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_SECRET}`,
      },
      body: JSON.stringify(servers),
    })

    if (!response.ok) {
      console.error("Failed to update server list:", await response.text())
    }
  } catch (error) {
    console.error("Error updating server list:", error)
  }
}

// Increment command usage
async function incrementCommandUsage(commandName) {
  try {
    const response = await fetch(`${DASHBOARD_URL}/api/bot/increment-command`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_SECRET}`,
      },
      body: JSON.stringify({ commandName }),
    })

    if (!response.ok) {
      console.error("Failed to increment command usage:", await response.text())
    }
  } catch (error) {
    console.error("Error incrementing command usage:", error)
  }
}

// Get guild prefix
async function getGuildPrefix(guildId) {
  try {
    const response = await fetch(`${DASHBOARD_URL}/api/bot/config?guildId=${guildId}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET}`,
      },
    })

    if (response.ok) {
      const config = await response.json()
      return config.prefix || "!"
    }

    return "!" // Default prefix
  } catch (error) {
    console.error(`Error fetching prefix for guild ${guildId}:`, error)
    return "!" // Default prefix
  }
}

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN)

export default client

