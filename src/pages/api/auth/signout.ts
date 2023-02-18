import { deleteCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';
import { csrf } from '@/lib/csrf';

function signOut(req: NextApiRequest, res: NextApiResponse) {
  try {
    deleteCookie("mi-auth.token", { req, res })
    res.status(200).json({ status: "success" })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(signOut)