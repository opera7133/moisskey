import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { csrf } from '@/lib/csrf';
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken"

interface Summary {
  userId?: string;
  title: string;
  description?: string;
  thumbnail?: string;
  draft: boolean;
  hidden: boolean;
  tags: Array<string>;
  data: any;
}

type isTarget = (arg: unknown) => boolean;

async function saveDraft(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body) return res.status(400).json({ status: "error", error: "data not provided" })
    const jwtToken = getCookie("mi-auth.token", { req, res })?.toString() || ""
    //@ts-ignore
    const { uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY)
    const data: Summary = req.body
    const old = (await prisma.summary.findMany({
      where: {
        userId: uid,
        draft: true,
      }
    }))[0]
    const tags = data.tags.map(tag => (
      prisma.tags.upsert({
        where: {
          name: tag,
        },
        update: {},
        create: {
          name: tag
        },
      })
    ))
    const createTags = await prisma.$transaction([...tags])
    if (old) {
      const updateDraft = await prisma.summary.update({
        where: {
          id: old.id
        },
        data: {
          userId: uid,
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          draft: true,
          hidden: data.hidden,
          data: data.data
        }
      })
      const createTagsData = createTags.map((tag) => ({ summaryId: old.id, tagsId: tag.id }))
      const deleteTags = await prisma.tagsOnSummaries.deleteMany({
        where: {
          summaryId: old.id
        }
      })
      const updateTags = await prisma.tagsOnSummaries.createMany({
        data: createTagsData
      })
      return res.status(200).json({ status: "success", data: updateDraft })
    } else {
      const newDraft = await prisma.summary.create({
        data: {
          userId: uid,
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          draft: true,
          hidden: data.hidden,
          data: data.data
        }
      })
      const createTagsData = createTags.map((tag) => ({ summaryId: newDraft.id, tagsId: tag.id }))
      const updateTags = await prisma.tagsOnSummaries.createMany({
        data: createTagsData
      })
      return res.status(200).json({ status: "success", data: newDraft })
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(saveDraft)