import { type NextRequest, NextResponse } from "next/server"
import { getOAuthClient, getAuthUrl } from "@/lib/google-fit"

export async function GET(request: NextRequest) {
  try {
    const oauth2Client = getOAuthClient()
    const authUrl = getAuthUrl(oauth2Client)

    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("Error generating auth URL:", error)
    return NextResponse.json({ error: "Failed to generate authentication URL" }, { status: 500 })
  }
}
