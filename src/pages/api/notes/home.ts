import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import { getCookie } from "cookies-next";

type PostData = {
  i: string;
  limit: number;
  untilDate?: number;
}

export default async function getHome(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!process.env.MIAUTH_KEY) return res.status(500).json({ status: "error", error: "key is not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { token } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const origin = getCookie("mi-auth.origin", { req, res })
    const apiURL = new URL("/api/notes/timeline", origin?.toString())
    const postData: PostData = { i: token, limit: 20 }
    if (req.query.untilDate) postData.untilDate = Number(req.query.untilDate)
    const notes = await (await fetch(apiURL.toString(), { method: "POST", body: JSON.stringify(postData), headers: { "Content-Type": "application/json" } })).json()
    return res.status(200).json({ status: "success", notes: notes })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}