import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { csrf } from "@/lib/csrf"

const postComment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body || !req.body.summaryId) return res.status(400).json({ status: "error", error: "data not provided" })
    const summary = await prisma.summary.findUnique({
      where: {
        id: req.body.summaryId
      },
      include: {
        comments: {
          include: {
            user: true,
            replyFrom: true,
            replyTo: true,
            likedBy: true,
          },
        },
      }
    })
    if (!summary) return res.status(400).json({ status: "error", error: "no summary found" })
    return res.status(200).json({ status: "success", data: summary.comments })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(postComment)