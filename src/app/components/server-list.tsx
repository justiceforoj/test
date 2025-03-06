"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { ChevronRight } from "lucide-react"

interface Server {
  id: string
  name: string
  memberCount: number
  icon: string | null
  joined: string
}

export function ServerList({ onSelectServer }: { onSelectServer: (serverId: string) => void }) {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchServers() {
      try {
        const response = await fetch("/api/bot/servers")

        if (!response.ok) {
          throw new Error("Failed to fetch servers")
        }

        const data = await response.json()
        setServers(data)
      } catch (err) {
        console.error("Error fetching servers:", err)
        setError("Failed to load servers")
      } finally {
        setLoading(false)
      }
    }

    fetchServers()
  }, [])

  if (loading) {
    return <div>Loading servers...</div>
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Servers ({servers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {servers.map((server) => (
            <div
              key={server.id}
              className="flex items-center justify-between p-2 border rounded hover:bg-accent/50 cursor-pointer"
              onClick={() => onSelectServer(server.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {server.icon ? (
                    <AvatarImage src={server.icon} alt={server.name} />
                  ) : (
                    <AvatarFallback>{server.name.substring(0, 2)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">{server.name}</div>
                  <div className="text-xs text-muted-foreground">{server.memberCount} members</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}

          {servers.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No servers found. Invite your bot to a server to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

