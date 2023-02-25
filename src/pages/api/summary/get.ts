import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { csrf } from '@/lib/csrf';

async function getSummary(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body || !req.body.summaryId) return res.status(400).json({ status: "error", error: "summary id not provided" })
    const summary = await prisma.summary.findUnique({
      where: {
        id: req.body.summaryId
      },
      include: {
        user: true
      }
    })
    if (summary && summary?.hidden !== "PRIVATE") {
      return res.status(200).json({ status: "success", data: summary })
    } else {
      return res.status(404).json({ status: "error", error: "summary not found" })
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(getSummary)