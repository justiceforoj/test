"use client"

import type React from "react"

import { BarChart, Bot, Command, Database, LayoutDashboard, MessageSquare, Server, Settings, Users } from "lucide-react"
import Link from "next/link"
import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"
import { useState } from "react"

interface SidebarItemProps {
  icon: React.ElementType
  title: string
  href: string
  isActive?: boolean
}

function SidebarItem({ icon: Icon, title, href, isActive }: SidebarItemProps) {
  return (
    <Link href={href} className="w-full">
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn("w-full justify-start", isActive ? "bg-secondary" : "hover:bg-muted")}
      >
        <Icon className="mr-2 h-5 w-5" />
        {title}
      </Button>
    </Link>
  )
}

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("dashboard")

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="py-2">
          <h2 className="px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
          <div className="mt-3 space-y-1">
            <SidebarItem
              icon={LayoutDashboard}
              title="Overview"
              href="/dashboard"
              isActive={activeItem === "dashboard"}
            />
            <SidebarItem icon={Bot} title="Bot Status" href="/bot-status" isActive={activeItem === "bot-status"} />
            <SidebarItem icon={Command} title="Commands" href="/commands" isActive={activeItem === "commands"} />
          </div>
        </div>
        <div className="py-2">
          <h2 className="px-4 text-lg font-semibold tracking-tight">Configuration</h2>
          <div className="mt-3 space-y-1">
            <SidebarItem icon={Server} title="Servers" href="/servers" isActive={activeItem === "servers"} />
            <SidebarItem
              icon={MessageSquare}
              title="Auto Responses"
              href="/auto-responses"
              isActive={activeItem === "auto-responses"}
            />
            <SidebarItem
              icon={Database}
              title="Custom Commands"
              href="/custom-commands"
              isActive={activeItem === "custom-commands"}
            />
          </div>
        </div>
        <div className="py-2">
          <h2 className="px-4 text-lg font-semibold tracking-tight">Analytics</h2>
          <div className="mt-3 space-y-1">
            <SidebarItem icon={BarChart} title="Usage Stats" href="/stats" isActive={activeItem === "stats"} />
            <SidebarItem
              icon={Users}
              title="User Activity"
              href="/user-activity"
              isActive={activeItem === "user-activity"}
            />
          </div>
        </div>
        <div className="py-2 mt-auto">
          <div className="space-y-1">
            <SidebarItem icon={Settings} title="Settings" href="/settings" isActive={activeItem === "settings"} />
          </div>
        </div>
      </div>
    </div>
  )
}

