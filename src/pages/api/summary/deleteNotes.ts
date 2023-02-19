import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma";
import { getCookie } from "cookies-next";
import { csrf } from '@/lib/csrf';
import jwt from "jsonwebtoken"
import { NoteType, TextType, URLType } from "@/types/note";

async function deleteNotes(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body || !req.body.summaryId || !req.body.data) return res.status(400).json({ status: "error", error: "summary id not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const summary = await prisma.summary.findUnique({
      where: {
        id: req.body.summaryId
      }
    })
    if (!summary || !summary.data) return res.status(400).json({ status: "error", error: "summary not found" })
    if (summary.userId === uid) return res.status(400).json({ status: "error", error: "自分のまとめは報告できません" })
    const oldData = JSON.parse(JSON.stringify(summary.data as Prisma.JsonArray));
    const strData = JSON.stringify(req.body.data)
    const updatedData = oldData.filter((item: any) => {
      return strData.indexOf(JSON.stringify(item)) < 0
    })
    const updateSummary = await prisma.summary.update({
      where: {
        id: summary.id
      },
      data: {
        data: updatedData
      }
    })
    return res.status(200).json({ status: "success", data: updateSummary })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(deleteNotes)