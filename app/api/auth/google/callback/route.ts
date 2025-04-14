import { type NextRequest, NextResponse } from "next/server"
import { getOAuthClient, getTokens } from "@/lib/google-fit"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "No authorization code provided" }, { status: 400 })
    }

    const oauth2Client = getOAuthClient()
    const tokens = await getTokens(oauth2Client, code)

    // Store tokens in cookies (in a real app, you'd want to store these more securely)
    const cookieStore = cookies()
    cookieStore.set("google_access_token", tokens.access_token || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600,
      path: "/",
    })

    if (tokens.refresh_token) {
      cookieStore.set("google_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      })
    }

    // Redirect back to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Error handling callback:", error)
    return NextResponse.json({ error: "Failed to authenticate with Google" }, { status: 500 })
  }
}
