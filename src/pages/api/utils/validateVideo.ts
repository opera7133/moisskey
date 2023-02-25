import type { NextApiRequest, NextApiResponse } from "next";
import metaFetcher from 'meta-fetcher';

export default async function validateVideo(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body.url) return res.status(400).json({ status: "error", error: "URL not provided" })
    const data = {
      type: "video",
      id: "",
      service: "",
      url: req.body.url,
      title: "",
      thumbnail: "",
    }
    const youtubeReg = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/
    const niconicoReg = /http(?:s?):\/\/(?:www\.)?nico(?:video\.jp\/watch|\.ms)\/(sm[A-Za-z0-9]+)/
    const bilibiliReg = /http(?:s?):\/\/(?:www\.bilibili\.com\/video|b23\.tv)\/(BV[A-Za-z0-9]+)/
    if (youtubeReg.test(data.url)) data.service = "youtube"
    if (niconicoReg.test(data.url)) data.service = "niconico"
    if (bilibiliReg.test(data.url)) data.service = "bilibili"
    if (!data.service) return res.status(400).json({ status: "error", error: "URL is not in the specified format" })
    const metadata = await metaFetcher(data.url)
    switch (data.service) {
      case "youtube":
        data.id = data.url.match(youtubeReg)[1]
        break;
      case "niconico":
        data.id = data.url.match(niconicoReg)[1]
        break;
      case "bilibili":
        data.id = data.url.match(bilibiliReg)[1]
        break;
    }
    if (!metadata.metadata.title) return res.status(404).json({ status: "error", error: "動画が見つかりません" })
    data.title = metadata.metadata.title.replace("_哔哩哔哩_bilibili", "").replace(" - ニコニコ動画", "").replace(" - YouTube", "")
    data.thumbnail = metadata.metadata.banner?.replace("@100w_100h_1c.png", "").replace("//i2.hdslb.com", "https://i2.hdslb.com") || ""
    return res.status(200).json({ status: "success", data: data })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}