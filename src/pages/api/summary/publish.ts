import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getCookie } from "cookies-next";
import { csrf } from '@/lib/csrf';
import { ImageType, NoteType, TextType, URLType } from "@/types/note";
import { parse, toHtml } from "@opera7133/mfmp"
import jwt from "jsonwebtoken"

interface Summary {
  summaryId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  draft: boolean;
  hidden: boolean;
  tags: Array<string>;
  data: any;
}

type isTarget = (arg: unknown) => boolean;

async function publishSummary(req: NextApiRequest, res: NextApiResponse) {
  const getHost = (note: NoteType, origin: string) => {
    let url = ""
    if (note.renoteId) {
      url = note.renote?.user.host
        ? note.renote?.user.host
        : origin
    } else {
      url = note.user.host
        ? note.user.host
        : origin
    }
    return url
  }
  try {
    if (!req.body) return res.status(400).json({ status: "error", error: "data not provided" })
    const data: Summary = req.body
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { uid, origin } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    data.data = data.data.map((at: NoteType | TextType | URLType | ImageType) => {
      if (at.type === "note") {
        if (at.renote && at.renote.text && !at.text) {
          if (at.renote.user.host) {
            return { ...at, renote: { ...at.renote, html: toHtml(parse(at.renote.text), { url: getHost(at, origin) }) } }
          } else {
            return { ...at, renote: { ...at.renote, html: toHtml(parse(at.renote.text), { url: getHost(at, origin) }), user: { ...at.renote.user, host: origin } } }
          }
        } else if (at.text) {
          if (at.user.host) {
            return { ...at, html: toHtml(parse(at.text), { url: getHost(at, origin) }) }
          } else {
            return { ...at, html: toHtml(parse(at.text), { url: getHost(at, origin) }), user: { ...at.user, host: origin } }
          }
        }
      } else {
        return at
      }
    })
    const tags = data.tags.map(tag => (
      prisma.tags.upsert({
        where: {
          name: tag.trim(),
        },
        update: {},
        create: {
          name: tag.trim(),
        },
      })
    ))
    const createTags = await prisma.$transaction([...tags])
    const old = (await prisma.summary.findMany({
      where: {
        userId: uid,
        draft: true,
      }
    }))[0]
    if (old || data.summaryId) {
      const updateSummary = await prisma.summary.update({
        where: {
          id: old ? old.id : Number(data.summaryId)
        },
        data: {
          userId: uid,
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          draft: false,
          hidden: data.hidden,
          data: data.data
        }
      })
      const createTagsData = createTags.map((tag) => ({ summaryId: old ? old.id : Number(data.summaryId), tagsId: tag.id }))
      const deleteTags = await prisma.tagsOnSummaries.deleteMany({
        where: {
          summaryId: old ? old.id : Number(data.summaryId)
        }
      })
      const updateTags = await prisma.tagsOnSummaries.createMany({
        data: createTagsData
      })
      return res.status(200).json({ status: "success", data: updateSummary })
    } else {
      const newSummary = await prisma.summary.create({
        data: {
          userId: uid,
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          draft: false,
          hidden: data.hidden,
          data: data.data
        }
      })
      const createTagsData = createTags.map((tag) => ({ summaryId: newSummary.id, tagsId: tag.id }))
      const updateTags = await prisma.tagsOnSummaries.createMany({
        data: createTagsData
      })
      return res.status(200).json({ status: "success", data: newSummary })
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(publishSummary)