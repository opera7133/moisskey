import { deleteCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default function signOut(req: NextApiRequest, res: NextApiResponse) {
  try {
    deleteCookie("mi-auth.id", { req, res })
    deleteCookie("mi-auth.token", { req, res })
    deleteCookie("mi-auth.origin", { req, res })
    res.status(200).json({ status: "success" })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}