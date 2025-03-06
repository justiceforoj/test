"use client"

import { useState, useEffect } from "react"
import { FormDescription, FormLabel } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Switch } from "@/app/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Button } from "@/app/components/ui/button"
import { useToast } from "@/app/components/ui/use-toast"

export function GuildSettings({ guildId = "" }) {
  const [prefix, setPrefix] = useState("!")
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome to the server, {user}!")
  const [logChannel, setLogChannel] = useState("bot-logs")
  const [moderationEnabled, setModerationEnabled] = useState(true)
  const [autoRole, setAutoRole] = useState("member")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Skip if no guild is selected
    if (!guildId) {
      setLoading(false)
      return
    }

    async function fetchGuildConfig() {
      try {
        const response = await fetch(`/api/bot/config?guildId=${guildId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch guild configuration")
        }

        const config = await response.json()

        // Update state with fetched config
        setPrefix(config.prefix || "!")
        setWelcomeMessage(config.welcomeMessage || "Welcome to the server, {user}!")
        setLogChannel(config.logChannel || "bot-logs")
        setModerationEnabled(config.moderationEnabled !== undefined ? config.moderationEnabled : true)
        setAutoRole(config.autoRole || "member")
      } catch (error) {
        console.error("Error fetching guild config:", error)
        toast({
          title: "Error",
          description: "Failed to load guild configuration",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchGuildConfig()
  }, [guildId, toast])

  const saveConfig = async () => {
    if (!guildId) {
      toast({
        title: "Error",
        description: "No guild selected",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const config = {
        prefix,
        welcomeMessage,
        logChannel,
        moderationEnabled,
        autoRole,
      }

      const response = await fetch("/api/bot/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guildId, config }),
      })

      if (!response.ok) {
        throw new Error("Failed to save configuration")
      }

      toast({
        title: "Success",
        description: "Guild configuration saved successfully",
      })
    } catch (error) {
      console.error("Error saving guild config:", error)
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading guild settings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <FormLabel htmlFor="prefix">Command Prefix</FormLabel>
          <Input id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="!" />
          <FormDescription>The character that triggers bot commands</FormDescription>
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="log-channel">Log Channel</FormLabel>
          <Input
            id="log-channel"
            value={logChannel}
            onChange={(e) => setLogChannel(e.target.value)}
            placeholder="bot-logs"
          />
          <FormDescription>Channel where bot logs will be sent</FormDescription>
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="welcome-message">Welcome Message</FormLabel>
        <Textarea
          id="welcome-message"
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          placeholder="Welcome to the server, {user}!"
          className="min-h-[100px]"
        />
        <FormDescription>Message sent when a new user joins. Use {"{user}"} to mention the user.</FormDescription>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <FormLabel htmlFor="auto-role">Auto Role</FormLabel>
          <Select value={autoRole} onValueChange={setAutoRole}>
            <SelectTrigger id="auto-role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>Role automatically assigned to new members</FormDescription>
        </div>

        <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
          <div className="space-y-0.5">
            <FormLabel>Auto Moderation</FormLabel>
            <FormDescription>Automatically moderate messages for spam and inappropriate content</FormDescription>
          </div>
          <Switch checked={moderationEnabled} onCheckedChange={setModerationEnabled} />
        </div>
      </div>

      <Button onClick={saveConfig} disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  )
}

