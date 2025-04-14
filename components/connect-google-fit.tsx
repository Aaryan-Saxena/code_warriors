"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ConnectGoogleFit() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // First check the debug endpoint to verify the redirect URI
      const debugResponse = await fetch("/api/auth/google/debug")
      if (!debugResponse.ok) {
        throw new Error("Failed to verify OAuth configuration")
      }

      const debugData = await debugResponse.json()
      setDebugInfo(debugData)

      // Redirect to the Google OAuth flow
      window.location.href = "/api/auth/google"
    } catch (error) {
      console.error("Error connecting to Google Fit:", error)
      setError("Failed to connect to Google Fit. Please try again later.")
      setIsConnecting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Fitness Data</CardTitle>
        <CardDescription>Connect to Google Fit to power up your character with real-world activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="p-4 bg-green-100 rounded-full">
            <Activity className="h-12 w-12 text-green-600" />
          </div>
          <p className="text-center text-sm text-gray-500">
            Link your Google Fit account to automatically sync your steps, sleep, and workout data to power your in-game
            character.
          </p>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {debugInfo && (
            <div className="text-xs text-gray-500 border p-2 rounded mt-4 w-full">
              <p>Redirect URI: {debugInfo.redirectUri}</p>
              <p>Client ID: {debugInfo.clientId}</p>
              <p>App URL: {debugInfo.appUrl}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleConnect} disabled={isConnecting} className="bg-green-600 hover:bg-green-700">
          {isConnecting ? "Connecting..." : "Connect Google Fit"}
        </Button>
      </CardFooter>
    </Card>
  )
}
