import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function postSummary(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body.userId) return res.status(200).json({ status: "error", error: "userid not provided" })
    const drafts = await prisma.summary.findMany({
      where: {
        userId: req.body.userId,
        draft: true
      }
    })
    return res.status(200).json({ status: "success", data: drafts[0] })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}