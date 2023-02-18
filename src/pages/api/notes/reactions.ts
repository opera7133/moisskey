import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import { getCookie } from "cookies-next";
import { prisma } from "@/lib/prisma";
import { csrf } from '@/lib/csrf';
import { NoteType } from "@/types/note";
import { parse, toHtml } from "@opera7133/mfmp";
import { getHost } from "@/lib/getHost";

type PostData = {
  i: string;
  limit: number;
  untilDate?: number;
  userId: string;
}

async function getFavorites(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!process.env.MIAUTH_KEY) return res.status(500).json({ status: "error", error: "key is not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { token, origin, uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const user = await prisma.user.findUnique({
      where: {
        id: uid
      },
    })
    if (!user) return res.status(500).json({ status: "error", error: "User Not Found" })
    const apiURL = new URL("/api/users/reactions", origin?.toString())
    const postData: PostData = { i: token, limit: 20, userId: user.userId }
    if (req.query.untilDate) postData.untilDate = Number(req.query.untilDate)
    let notes = await (await fetch(apiURL.toString(), { method: "POST", body: JSON.stringify(postData), headers: { "Content-Type": "application/json" } })).json()
    return res.status(200).json({
      status: "success", notes: notes.map((reaction: any) => {
        if (reaction.note.renote && reaction.note.renote.text && !reaction.note.text) {
          return { ...reaction.note, renote: { ...reaction.note.renote, html: toHtml(parse(reaction.note.renote.text), { url: getHost(reaction.note.renote, origin) }), user: { ...reaction.note.renote.user, host: getHost(reaction.note.renote, origin) } } }
        } else {
          return { ...reaction.note, html: toHtml(parse(reaction.note.text), { url: getHost(reaction.note, origin) }), user: { ...reaction.note.user, host: getHost(reaction.note, origin) } }
        }
      })
    })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(getFavorites)