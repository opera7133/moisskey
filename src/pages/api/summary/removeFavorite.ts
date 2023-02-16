import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getCookie } from "cookies-next";
import { csrf } from '@/lib/csrf';

async function removeFavorite(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body || !req.body.summaryId) return res.status(400).json({ status: "error", error: "summary id not provided" })
    const userId = getCookie("mi-auth.id", { req, res })?.toString() || ""
    const deleteFav = await prisma.favoritesOnSummaries.deleteMany({
      where: {
        userId: userId,
        summaryId: req.body.summaryId
      }
    })
    return res.status(200).json({ status: "success", data: deleteFav })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(removeFavorite)