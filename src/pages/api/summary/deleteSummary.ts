import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getCookie } from "cookies-next";
import { csrf } from '@/lib/csrf';

async function deleteSummary(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body || !req.body.summaryId) return res.status(400).json({ status: "error", error: "summary id not provided" })
    const userId = getCookie("mi-auth.id", { req, res })?.toString() || ""
    const deleteSammary = await prisma.summary.deleteMany({
      where: {
        userId: userId,
        id: req.body.summaryId
      }
    })
    return res.status(200).json({ status: "success", data: deleteSammary })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(deleteSummary)