import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { URL, URLSearchParams } from "url"
import { csrf } from '@/lib/csrf';

async function SignIn(req: NextApiRequest, res: NextApiResponse) {
  try {
    const origin = "https://" + (req.body.origin || "misskey.vcborn.com")
    const permission = "read:account,read:favorites,read:reactions"
    const params = new URLSearchParams({
      name: "Moisskey",
      callback: new URL("/api/auth/callback", process.env.MIAUTH_URL).toString(),
      permission: permission
    })
    const session = v4()
    const gen = new URL(`/miauth/${session}`, origin.toString())
    gen.search = params.toString()
    return res.status(307).json({ status: "redirect", redirect: gen.toString() })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(SignIn)