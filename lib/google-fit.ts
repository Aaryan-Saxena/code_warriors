import { google } from "googleapis"
import type { OAuth2Client } from "google-auth-library"

// Initialize OAuth client with credentials
export function getOAuthClient() {
  // Get the redirect URI from environment variables or construct it dynamically
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

  console.log("Using redirect URI:", redirectUri) // For debugging

  return new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUri)
}

// Generate authorization URL
export function getAuthUrl(oauth2Client: OAuth2Client) {
  const scopes = [
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.sleep.read",
    "https://www.googleapis.com/auth/fitness.body.read",
  ]

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
    // Include the redirect_uri explicitly to ensure it matches
    redirect_uri: oauth2Client._redirectUri,
  })
}

// Exchange code for tokens
export async function getTokens(oauth2Client: OAuth2Client, code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
  return tokens
}

// Update the getStepCount function to handle potential errors better
export async function getStepCount(oauth2Client: OAuth2Client) {
  const fitness = google.fitness({ version: "v1", auth: oauth2Client })

  const now = new Date()
  const startTime = new Date()
  startTime.setHours(0, 0, 0, 0) // Start of today

  const request = {
    userId: "me",
    aggregateBy: [
      {
        dataTypeName: "com.google.step_count.delta",
      },
    ],
    bucketByTime: { durationMillis: 86400000 }, // 1 day in milliseconds
    startTimeMillis: startTime.getTime(),
    endTimeMillis: now.getTime(),
  }

  try {
    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: request,
    })

    let steps = 0
    if (response.data.bucket && response.data.bucket.length > 0) {
      const bucket = response.data.bucket[0]
      if (bucket.dataset && bucket.dataset.length > 0) {
        const dataset = bucket.dataset[0]
        if (dataset.point && dataset.point.length > 0) {
          steps = dataset.point.reduce((total, point) => {
            if (point.value && point.value.length > 0) {
              return total + (point.value[0].intVal || 0)
            }
            return total
          }, 0)
        }
      }
    }

    console.log("Retrieved step count:", steps)
    return steps
  } catch (error) {
    console.error("Error fetching step count:", error)
    // Return 0 instead of throwing to prevent app crashes
    return 0
  }
}

// Update the getSleepData function to handle potential errors better
export async function getSleepData(oauth2Client: OAuth2Client) {
  const fitness = google.fitness({ version: "v1", auth: oauth2Client })

  const now = new Date()
  const startTime = new Date()
  startTime.setDate(startTime.getDate() - 7) // Get sleep data for the past week

  const request = {
    userId: "me",
    aggregateBy: [
      {
        dataTypeName: "com.google.sleep.segment",
      },
    ],
    bucketByTime: { durationMillis: 86400000 * 7 }, // 7 days in milliseconds
    startTimeMillis: startTime.getTime(),
    endTimeMillis: now.getTime(),
  }

  try {
    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: request,
    })

    let sleepDurationMillis = 0
    if (response.data.bucket && response.data.bucket.length > 0) {
      response.data.bucket.forEach((bucket) => {
        if (bucket.dataset && bucket.dataset.length > 0) {
          bucket.dataset.forEach((dataset) => {
            if (dataset.point && dataset.point.length > 0) {
              dataset.point.forEach((point) => {
                if (point.value && point.value.length > 0) {
                  // Sleep segments are in milliseconds
                  const startTimeMillis = point.startTimeNanos ? Number(point.startTimeNanos) / 1000000 : 0
                  const endTimeMillis = point.endTimeNanos ? Number(point.endTimeNanos) / 1000000 : 0
                  sleepDurationMillis += endTimeMillis - startTimeMillis
                }
              })
            }
          })
        }
      })
    }

    // Convert milliseconds to hours and average over the past week
    const sleepHours = sleepDurationMillis / (1000 * 60 * 60) / 7
    console.log("Retrieved average sleep hours:", sleepHours)
    return sleepHours
  } catch (error) {
    console.error("Error fetching sleep data:", error)
    // Return a default value instead of throwing
    return 7.0
  }
}

// Get active minutes from Google Fit
export async function getActiveMinutes(oauth2Client: OAuth2Client) {
  const fitness = google.fitness({ version: "v1", auth: oauth2Client })

  const now = new Date()
  const startTime = new Date()
  startTime.setHours(0, 0, 0, 0) // Start of today

  const request = {
    userId: "me",
    aggregateBy: [
      {
        dataTypeName: "com.google.active_minutes",
      },
    ],
    bucketByTime: { durationMillis: 86400000 }, // 1 day in milliseconds
    startTimeMillis: startTime.getTime(),
    endTimeMillis: now.getTime(),
  }

  try {
    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: request,
    })

    let activeMinutes = 0
    if (response.data.bucket && response.data.bucket.length > 0) {
      const bucket = response.data.bucket[0]
      if (bucket.dataset && bucket.dataset.length > 0) {
        const dataset = bucket.dataset[0]
        if (dataset.point && dataset.point.length > 0) {
          activeMinutes = dataset.point.reduce((total, point) => {
            if (point.value && point.value.length > 0) {
              return total + (point.value[0].intVal || 0)
            }
            return total
          }, 0)
        }
      }
    }

    return activeMinutes
  } catch (error) {
    console.error("Error fetching active minutes:", error)
    throw error
  }
}

// Update the getAllFitnessData function to handle errors better
export async function getAllFitnessData(oauth2Client: OAuth2Client) {
  try {
    // Execute all requests in parallel for better performance
    const [steps, sleepHours, activeMinutes] = await Promise.all([
      getStepCount(oauth2Client),
      getSleepData(oauth2Client),
      getActiveMinutes(oauth2Client),
    ])

    console.log("All fitness data retrieved:", { steps, sleepHours, activeMinutes })
    return {
      steps,
      sleepHours,
      activeMinutes,
    }
  } catch (error) {
    console.error("Error fetching fitness data:", error)
    // Return default values instead of throwing
    return {
      steps: 0,
      sleepHours: 7.0,
      activeMinutes: 0,
    }
  }
}
