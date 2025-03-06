"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Bot } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Discord Bot Dashboard</CardTitle>
          <CardDescription>Sign in with your Discord account to manage your bot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button className="w-full" onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}>
              Sign in with Discord
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

