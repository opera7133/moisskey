import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getCookie } from "cookies-next";
import { csrf } from '@/lib/csrf';
import jwt from "jsonwebtoken"

async function hideSummary(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body || !req.body.summaryId) return res.status(400).json({ status: "error", error: "summary id not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const user = await prisma.user.findUnique({
      where: {
        id: uid
      }
    })
    if (!user?.isAdmin) return res.status(403).json({ status: "error", error: "Not Allowed" })
    const hiddenSummary = await prisma.summary.update({
      where: {
        id: Number(req.body.summaryId)
      },
      data: {
        hidden: "PRIVATE"
      }
    })
    return res.status(200).json({ status: "success", data: hiddenSummary })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(hideSummary)