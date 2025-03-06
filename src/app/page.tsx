"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { BotStats } from "@/app/components/bot-stats"
import { CommandsList } from "@/app/components/commands-list"
import { GuildSettings } from "@/app/components/guild-settings"
import { ServerList } from "@/app/components/server-list"
import { Header } from "@/app/components/header"
import { Sidebar } from "@/app/components/sidebar"
import { ToastProvider } from "@/app/components/ui/toast"
import { Toaster } from "@/app/components/ui/toaster"

export default function Dashboard() {
  const [selectedGuildId, setSelectedGuildId] = useState("")

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Button>Update Bot Status</Button>
            </div>
            <div className="grid gap-6">
              <BotStats />
              <div className="grid gap-6 md:grid-cols-2">
                <ServerList onSelectServer={setSelectedGuildId} />
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Server</CardTitle>
                    <CardDescription>
                      {selectedGuildId ? "Configure settings for this server" : "Select a server to configure"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedGuildId ? (
                      <p className="text-sm">Server ID: {selectedGuildId}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No server selected</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              <Tabs defaultValue="commands">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="commands">Commands</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="commands" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bot Commands</CardTitle>
                      <CardDescription>Configure and manage your bot commands.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CommandsList />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button>Add Command</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="settings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bot Settings</CardTitle>
                      <CardDescription>Configure your bot settings and behavior.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GuildSettings guildId={selectedGuildId} />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="logs" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bot Logs</CardTitle>
                      <CardDescription>View your bot activity and error logs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="rounded-md bg-muted p-4">
                          <div className="font-mono text-sm">[2023-06-01 12:34:56] Bot started successfully</div>
                        </div>
                        <div className="rounded-md bg-muted p-4">
                          <div className="font-mono text-sm">[2023-06-01 12:35:23] Joined server: Gaming Community</div>
                        </div>
                        <div className="rounded-md bg-muted p-4">
                          <div className="font-mono text-sm">[2023-06-01 12:40:12] Command executed: !help</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button variant="outline">Clear Logs</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </ToastProvider>
  )
}

