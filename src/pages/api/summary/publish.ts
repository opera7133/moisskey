import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getCookie } from "cookies-next";
import { csrf } from '@/lib/csrf';

interface Summary {
  summaryId?: string;
  userId: string;
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
  try {
    if (!req.body) return res.status(400).json({ status: "error", error: "data not provided" })
    const data: Summary = req.body
    const uid = getCookie("mi-auth.id", { req, res })?.toString() || ""
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