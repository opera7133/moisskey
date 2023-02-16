import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getCookie } from "cookies-next";
import { csrf } from '@/lib/csrf';

async function addFavorite(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body || !req.body.summaryId) return res.status(400).json({ status: "error", error: "summary id not provided" })
    const userId = getCookie("mi-auth.id", { req, res })?.toString() || ""
    const summary = await prisma.summary.findUnique({
      where: {
        id: req.body.summaryId
      }
    })
    if (!summary) return res.status(400).json({ status: "error", error: "summary not found" })
    if (summary.userId === userId) return res.status(400).json({ status: "error", error: "自分のまとめはお気に入りできません" })
    const newFav = await prisma.favoritesOnSummaries.create({
      data: {
        userId: userId,
        summaryId: req.body.summaryId
      }
    })
    return res.status(200).json({ status: "success", data: newFav })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(addFavorite)