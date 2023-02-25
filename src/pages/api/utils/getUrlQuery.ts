import type { NextApiRequest, NextApiResponse } from "next";
import urlMetadata from "url-metadata";
import { Iconv } from "iconv";
import jschardet from "jschardet";
import { v4 } from "uuid";

export default async function getUrlQuery(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body.url) return res.status(400).json({ status: "error", error: "url not provided" })
    const validation = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    if (!validation.test(req.body.url)) return res.status(400).json({ status: "error", error: "this isnt url" })
    const data = await urlMetadata(req.body.url, {
      decode: function (buf) {
        const detect = jschardet.detect(buf)
        if (detect && detect.encoding) {
          const iconv = new Iconv(detect.encoding, 'UTF-8//TRANSLIT//IGNORE')
          return iconv.convert(buf).toString()
        } else {
          return buf.toString()
        }
      }
    })
    return res.status(200).json({ status: "success", data: data })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}