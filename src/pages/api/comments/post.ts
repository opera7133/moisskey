import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { csrf } from "@/lib/csrf"
import { getCookie } from "cookies-next";

const postComment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body || !req.body.content || !req.body.summaryId) return res.status(400).json({ status: "error", error: "data not provided" })
    const uid = getCookie("mi-auth.id", { req, res })?.toString() || ""
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
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(postComment)