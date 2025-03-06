"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Switch } from "@/app/components/ui/switch"
import { Button } from "@/app/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { Skeleton } from "@/app/components/ui/skeleton"

interface Command {
  id: string
  name: string
  description: string
  enabled: boolean
  cooldown: number
  count?: number
}

export function CommandsList() {
  const [commands, setCommands] = useState<Command[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchCommands() {
      try {
        // Fetch command usage stats
        const usageResponse = await fetch("/api/bot/commands")

        if (!usageResponse.ok) {
          throw new Error("Failed to fetch command usage")
        }

        const usageData = await usageResponse.json()

        // For now, we'll use our predefined commands and merge with usage data
        // In a real app, you'd fetch the command list from the bot
        const commandList: Command[] = [
          {
            id: "1",
            name: "help",
            description: "Shows a list of available commands",
            enabled: true,
            cooldown: 5,
          },
          {
            id: "2",
            name: "ping",
            description: "Checks the bot's response time",
            enabled: true,
            cooldown: 3,
          },
          {
            id: "3",
            name: "ban",
            description: "Bans a user from the server",
            enabled: true,
            cooldown: 0,
          },
          {
            id: "4",
            name: "play",
            description: "Plays a song in the voice channel",
            enabled: false,
            cooldown: 2,
          },
          {
            id: "5",
            name: "weather",
            description: "Shows the weather for a location",
            enabled: true,
            cooldown: 10,
          },
        ]

        // Merge command list with usage data
        const mergedCommands = commandList.map((cmd) => {
          const usage = usageData.find((u) => u.name === cmd.name)
          return {
            ...cmd,
            count: usage ? usage.count : 0,
          }
        })

        // Add any commands from usage that aren't in our list
        usageData.forEach((usage) => {
          if (!mergedCommands.some((cmd) => cmd.name === usage.name)) {
            mergedCommands.push({
              id: `custom-${usage.name}`,
              name: usage.name,
              description: "Custom command",
              enabled: true,
              cooldown: 0,
              count: usage.count,
            })
          }
        })

        setCommands(mergedCommands)
      } catch (err) {
        console.error("Error fetching commands:", err)
        setError("Failed to load commands")
      } finally {
        setLoading(false)
      }
    }

    fetchCommands()
  }, [])

  const toggleCommand = (id: string) => {
    setCommands(commands.map((command) => (command.id === id ? { ...command, enabled: !command.enabled } : command)))

    // In a real app, you'd send this update to your API
    // Example: fetch('/api/bot/commands/toggle', { method: 'POST', body: JSON.stringify({ id }) })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Command</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Cooldown</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {commands.map((command) => (
          <TableRow key={command.id}>
            <TableCell className="font-medium">!{command.name}</TableCell>
            <TableCell>{command.description}</TableCell>
            <TableCell>{command.cooldown}s</TableCell>
            <TableCell>{command.count || 0}</TableCell>
            <TableCell>
              <Switch checked={command.enabled} onCheckedChange={() => toggleCommand(command.id)} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

