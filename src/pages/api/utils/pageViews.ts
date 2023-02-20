import { google } from "googleapis"
import { BetaAnalyticsDataClient } from "@google-analytics/data"
import { NextApiRequest, NextApiResponse } from 'next'
import { GA_PROPERTY_ID } from "@/lib/gtag"
const pageViewsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const startDate = req.query.startDate || '2023-02-01'
  const post = req.query.post

  try {
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

    console.log(GA_PROPERTY_ID)

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
              value: post.toString(),
              caseSensitive: true
            }
          }
        }
      } : {}),
      dateRanges: [{
        startDate: startDate.toString(),
        endDate: 'today'
      }]
    })

    const pageViews = response.totals

    return res.status(200).json({
      pageViews,
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