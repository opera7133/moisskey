import { prisma } from "@/lib/prisma"
import { getCookie } from "cookies-next"
import { NextApiRequest, NextApiResponse } from "next"
import { csrf } from '@/lib/csrf';
import jwt from "jsonwebtoken";

async function editSummary(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body || !req.body.summaryId) return res.status(400).json({ status: "error", error: "summaryId not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const summary = await prisma.summary.findMany({
      where: {
        id: Number(req.body.summaryId),
        userId: uid
      },
      include: {
        tags: {
          include: {
            tags: true
          }
        }
      }
    })
    if (summary) {
      return res.status(200).json({ status: "success", data: summary[0] })
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

export default csrf(editSummary)