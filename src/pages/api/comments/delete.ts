import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { csrf } from "@/lib/csrf"
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken"

const deleteComment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body || !req.body.commentId) return res.status(400).json({ status: "error", error: "data not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const deleteComment = await prisma.comments.deleteMany({
      where: {
        id: req.body.commentId,
        userId: uid
      }
    })
    return res.status(200).json({ status: "success", data: deleteComment })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(deleteComment)