import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { csrf } from "@/lib/csrf"
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken"

const postComment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body || !req.body.content || !req.body.summaryId) return res.status(400).json({ status: "error", error: "data not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const cuid = req.body.content.slice(0, 27)
    if (/^\[c[a-z0-9]{24}\]$/.test(cuid)) {
      const newComment = await prisma.comments.create({
        data: {
          userId: uid,
          summaryId: req.body.summaryId || "",
          content: req.body.content.replace(`${cuid} `, ""),
          replyTo: {
            connect: [{
              id: cuid.match(/^\[(c[a-z0-9]{24})\]$/)[1]
            }]
          }
        },
        include: {
          user: true,
          replyFrom: true,
          replyTo: {
            include: {
              user: true
            }
          },
          likedBy: true,
        }
      })
      return res.status(200).json({ status: "success", data: newComment })
    } else {
      const newComment = await prisma.comments.create({
        data: {
          userId: uid,
          summaryId: req.body.summaryId || "",
          content: req.body.content
        },
        include: {
          user: true,
          replyFrom: true,
          replyTo: true,
          likedBy: true,
        }
      })
      return res.status(200).json({ status: "success", data: newComment })
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(postComment)