import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { csrf } from "@/lib/csrf"
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken"

const postComment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body || !req.body.commentId) return res.status(400).json({ status: "error", error: "data not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    if (req.body.liked) {
      const removeLike = await prisma.likesOnComment.deleteMany({
        where: {
          userId: uid,
          commentId: req.body.commentId
        }
      })
      return res.status(200).json({ status: "success", data: removeLike })
    } else {
      const newLike = await prisma.likesOnComment.create({
        data: {
          userId: uid,
          commentId: req.body.commentId
        }
      })
      return res.status(200).json({ status: "success", data: newLike })
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