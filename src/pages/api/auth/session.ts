import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken"

async function getUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!process.env.MIAUTH_KEY || !req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') return res.status(500).json({ status: "error", error: "key is not provided" })
    const jwtToken = req.headers.authorization.split(' ')[1]
    //@ts-ignore
    const { token, uid, origin } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    if (!uid) return res.status(200).json({ status: "error", error: "Not Found" })
    const session = await (await fetch(`${origin}/api/auth/session/show`, { method: "POST", body: JSON.stringify({ token: token }) })).json()
    if (session.code === "NO_SUCH_SESSION") return res.status(404).json({ status: "error", error: "no such session" })
    const usr = await prisma.user.findUnique({
      where: {
        id: uid.toString()
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

export default getUser