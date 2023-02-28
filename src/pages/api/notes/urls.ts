import type { NextApiRequest, NextApiResponse } from "next";
import { csrf } from '@/lib/csrf';
import { parse, toHtml } from "@opera7133/mfmp";
import { getHost } from "@/lib/getHost";

type PostData = {
  noteId: string;
}

async function getByUrl(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body.urls) return res.status(400).json({ status: "error", error: "query not provided" })
    if (!process.env.MIAUTH_KEY) return res.status(500).json({ status: "error", error: "key is not provided" })
    const notes = await Promise.all(req.body.urls.map(async (url: string) => {
      const urlReg = /(https:\/\/([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,})\/notes\/(.*)/
      const params = url.match(urlReg)
      if (params) {
        const apiURL = new URL("/api/notes/show", params[1])
        const postData: PostData = { noteId: params[3] }
        let note = await (await fetch(apiURL.toString(), { method: "POST", body: JSON.stringify(postData), headers: { "Content-Type": "application/json" } })).json()
        if (note.renote && note.renote.text && !note.text) {
          note = { ...note, renote: { ...note.renote, html: toHtml(parse(note.renote.text), { url: getHost(note.renote, params[1]) }), user: { ...note.renote.user, host: getHost(note.renote, params[1]) } } }
        } else if (note.text) {
          note = { ...note, html: toHtml(parse(note.text), { url: getHost(note, params[1]) }), user: { ...note.user, host: getHost(note, params[1]) } }
        } else {
          throw new Error("ノートがありません")
        }
        return note
      } else {
        throw new Error("URLが正しくありません")
      }
    }))
    return res.status(200).json({ status: "success", notes: notes })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(getByUrl)