import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getOAuthClient, getAllFitnessData } from "@/lib/google-fit"
import { updatePlayerStats } from "@/lib/player-stats"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get("google_access_token")?.value
    const refreshToken = cookieStore.get("google_refresh_token")?.value

    if (!accessToken) {
      console.log("No access token found, user not authenticated with Google Fit")
      return NextResponse.json(
        {
          error: "Not authenticated with Google Fit",
          authenticated: false,
          // Return mock data so the app can still function
          steps: 5000,
          sleepHours: 7.0,
          activeMinutes: 30,
        },
        { status: 401 },
      )
    }

    const oauth2Client = getOAuthClient()
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    // Fetch fitness data from Google Fit
    console.log("Fetching fitness data from Google Fit...")
    const fitnessData = await getAllFitnessData(oauth2Client)
    console.log("Fitness data retrieved:", fitnessData)

    // Update player stats with the new fitness data
    const updatedStats = updatePlayerStats(fitnessData)
    console.log("Player stats updated:", updatedStats)

    return NextResponse.json({
      ...updatedStats,
      authenticated: true,
    })
  } catch (error) {
    console.error("Error fetching fitness data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch fitness data",
        authenticated: false,
        // Return mock data so the app can still function
        steps: 5000,
        sleepHours: 7.0,
        activeMinutes: 30,
      },
      { status: 500 },
    )
  }
}
