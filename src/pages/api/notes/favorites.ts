import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import { getCookie } from "cookies-next";
import { csrf } from '@/lib/csrf';
import { NoteType } from "@/types/note";
import { parse, toHtml } from "@opera7133/mfmp";
import { getHost } from "@/lib/getHost";

type PostData = {
  i: string;
  limit: number;
  untilDate?: number;
}

async function getFavorites(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!process.env.MIAUTH_KEY) return res.status(500).json({ status: "error", error: "key is not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { token, origin } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const apiURL = new URL("/api/i/favorites", origin?.toString())
    const postData: PostData = { i: token, limit: 20 }
    if (req.query.untilDate) postData.untilDate = Number(req.query.untilDate)
    const notes = await (await fetch(apiURL.toString(), { method: "POST", body: JSON.stringify(postData), headers: { "Content-Type": "application/json" } })).json()
    return res.status(200).json({
      status: "success", notes: notes.map((fav: any) => {
        if (fav.note.renote && fav.note.renote.text && !fav.note.text) {
          return { ...fav.note, renote: { ...fav.note.renote, html: toHtml(parse(fav.note.renote.text), { url: getHost(fav.note.renote, origin) }), user: { ...fav.note.renote.user, host: getHost(fav.note.renote, origin) } } }
        } else {
          return { ...fav.note, html: toHtml(parse(fav.note.text), { url: getHost(fav.note, origin) }), user: { ...fav.note.user, host: getHost(fav.note, origin) } }
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