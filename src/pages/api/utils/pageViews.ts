import { google } from "googleapis"
import { BetaAnalyticsDataClient } from "@google-analytics/data"
import { NextApiRequest, NextApiResponse } from 'next'
import { GA_PROPERTY_ID } from "@/lib/gtag"

export const getPV = async (startDate = "2023-02-01", post = "") => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  })

  const analyticsDataClient = new BetaAnalyticsDataClient({
    auth: auth
  });

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${GA_PROPERTY_ID}`,
    metrics: [
      {
        name: "screenPageViews"
      }
    ],
    dimensions: [
      {
        name: "pagePath"
      }
    ],
    ...(post ? {
      dimensionFilter: {
        filter: {
          fieldName: `pagePath`,
          stringFilter: {
            matchType: "EXACT",
            value: post,
            caseSensitive: true
          }
        }
      }
    } : {}),
    dateRanges: [{
      startDate: startDate,
      endDate: 'today'
    }]
  })

  const pv = response.rows?.length !== 0 ? response.rows?.map((row) => row.metricValues?.map((metric) => metric.value)[0]).reduce((a, b) => (a && b && Number(a) + Number(b))?.toString()) : "0"
  return pv
}

const pageViewsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const startDate = req.query.startDate || "2023-02-01"
  const post = req.query.post
  try {
    const pv = await getPV(startDate.toString(), post?.toString())
    return res.status(200).json({
      pv,
    })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default pageViewsAPI