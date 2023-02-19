import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getCookie } from "cookies-next";
import { csrf } from '@/lib/csrf';
import jwt from "jsonwebtoken"

async function addReport(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body || !req.body.summaryId || !req.body.reason) return res.status(400).json({ status: "error", error: "data not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const summary = await prisma.summary.findUnique({
      where: {
        id: req.body.summaryId
      }
    })
    if (!summary) return res.status(400).json({ status: "error", error: "summary not found" })
    if (summary.userId === uid) return res.status(400).json({ status: "error", error: "自分のまとめは報告できません" })
    const newReport = await prisma.reports.create({
      data: {
        userId: uid,
        summaryId: req.body.summaryId,
        reason: req.body.reason
      }
    })
    return res.status(200).json({ status: "success", data: newReport })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(addReport)