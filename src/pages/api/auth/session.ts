import type { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "cookies-next";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken"

export default async function getUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = getCookie("mi-auth.id", { req, res })
    if (!process.env.MIAUTH_KEY) return res.status(500).json({ status: "error", error: "key is not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { token } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const origin = getCookie("mi-auth.origin", { req, res })
    if (!id) return res.status(200).json({ status: "error", error: "Not Found" })
    const session = await (await fetch(`${origin}/api/auth/session/show`, { method: "POST", body: JSON.stringify({ token: token }) })).json()
    if (session.code === "NO_SUCH_SESSION") return res.status(404).json({ status: "error", error: "no such session" })
    const usr = await prisma.user.findUnique({
      where: {
        id: id.toString()
      }
    })
    return res.status(200).json({ status: "success", user: usr })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}