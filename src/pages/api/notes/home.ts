import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import { getCookie } from "cookies-next";
import { csrf } from '@/lib/csrf';
import { parse, toHtml } from "@opera7133/mfmp";
import { getHost } from "@/lib/getHost";
import { NoteType } from "@/types/note";

type PostData = {
  i: string;
  limit: number;
  untilDate?: number;
}

async function getHome(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!process.env.MIAUTH_KEY) return res.status(500).json({ status: "error", error: "key is not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { token, origin } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const apiURL = new URL("/api/notes/timeline", origin?.toString())
    const postData: PostData = { i: token, limit: 20 }
    if (req.query.untilDate) postData.untilDate = Number(req.query.untilDate)
    let notes = await (await fetch(apiURL.toString(), { method: "POST", body: JSON.stringify(postData), headers: { "Content-Type": "application/json" } })).json()
    notes = notes.map((note: NoteType) => {
      if (note.renote && note.renote.text && !note.text) {
        return { ...note, renote: { ...note.renote, html: toHtml(parse(note.renote.text), { url: getHost(note.renote, origin) }), user: { ...note.renote.user, host: getHost(note.renote, origin) } } }
      } else if (note.text) {
        return { ...note, html: toHtml(parse(note.text), { url: getHost(note, origin) }), user: { ...note.user, host: getHost(note, origin) } }
      } else {
        return note
      }
    })
    return res.status(200).json({ status: "success", notes: notes })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(getHome)