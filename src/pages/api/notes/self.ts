import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import { getCookie } from "cookies-next";
import { prisma } from "@/lib/prisma";
import { getUnixTime } from "date-fns";

type PostData = {
  i: string;
  limit: number;
  userId: string;
  untilDate?: number;
}

export default async function getSelf(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!process.env.MIAUTH_KEY) return res.status(500).json({ status: "error", error: "key is not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    const uid = getCookie("mi-auth.id", { req, res })?.toString() || ""
    //@ts-ignore
    const { token } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const origin = getCookie("mi-auth.origin", { req, res })
    const user = await prisma.user.findUnique({
      where: {
        id: uid
      },
    })
    const apiURL = new URL("/api/users/notes", origin?.toString())
    if (!user) return res.status(500).json({ status: "error", error: "User Not Found" })
    const postData: PostData = { i: token, limit: 20, userId: user.userId }
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