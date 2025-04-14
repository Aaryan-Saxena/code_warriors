import { type NextRequest, NextResponse } from "next/server"
import { getOAuthClient } from "@/lib/google-fit"

export async function GET(request: NextRequest) {
  try {
    const oauth2Client = getOAuthClient()

    // Return the redirect URI being used and other debug info
    return NextResponse.json({
      redirectUri: oauth2Client._redirectUri,
      clientId: process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + "...", // Show partial ID for security
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      vercelUrl: process.env.VERCEL_URL || "Not set",
      nodeEnv: process.env.NODE_ENV || "Not set",
    })
  } catch (error) {
    console.error("Error in debug route:", error)
    return NextResponse.json(
      {
        error: "Failed to get OAuth client information",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
