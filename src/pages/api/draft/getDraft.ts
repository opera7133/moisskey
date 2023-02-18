import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getCookie } from "cookies-next";
import { csrf } from '@/lib/csrf';
import jwt from "jsonwebtoken"

async function postSummary(req: NextApiRequest, res: NextApiResponse) {
  try {
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const drafts = await prisma.summary.findMany({
      where: {
        userId: uid,
        draft: true
      },
      include: {
        tags: {
          include: {
            tags: true
          }
        }
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

export default csrf(postSummary)