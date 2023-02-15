import { NextApiRequest, NextApiResponse } from "next"
import { setCookie } from 'cookies-next';
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query
  try {
    if (query.session && req.headers.referer) {
      const gen = new URL(`/api/miauth/${query.session}/check`, req.headers.referer)
      const check = await fetch(gen.toString(), { method: 'POST' })
      const json = await check.json()
      if (!process.env.MIAUTH_KEY) return res.status(500).json({ status: "error", error: "key is not provided" })
      if (json.ok) {
        const oldUser = await prisma.user.findUnique({
          where: {
            username: `${json.user.username}@${gen.hostname}`
          },
        })
        const token = jwt.sign({ token: json.token }, process.env.MIAUTH_KEY)
        setCookie("mi-auth.token", token, { req, res })
        setCookie('mi-auth.origin', req.headers.referer, { req, res });
        if (oldUser) {
          setCookie('mi-auth.id', oldUser.id, { req, res })
          const updateUser = await prisma.user.update({
            where: {
              username: `${json.user.username}@${gen.hostname}`
            },
            data: {
              name: json.user.name,
              avatar: json.user.avatarUrl,
              banner: json.user.bannerUrl,
              description: json.user.description,
              addata: json.user.fields,
              suspend: json.user.isLocked || json.user.isSuspended
            },
          })
        } else {
          const newUser = await prisma.user.create({
            data: {
              userId: json.user.id,
              username: `${json.user.username}@${gen.hostname}`,
              name: json.user.name,
              origin: gen.hostname,
              avatar: json.user.avatarUrl,
              banner: json.user.bannerUrl,
              description: json.user.description,
              addata: json.user.fields,
              suspend: json.user.isLocked || json.user.isSuspended
            }
          })
          setCookie('mi-auth.id', newUser.id, { req, res })
        }
        return res.redirect(307, "/")
      } else {
        return res.status(403).json({ status: "error", error: "Invalid Session ID" })
      }
    } else if (query.session) {
      return res.status(400).json({ status: "error", error: "Please Login Again" })
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}