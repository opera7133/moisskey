import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

interface Summary {
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

export default async function publishSummary(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body) return res.status(400).json({ status: "error", error: "data not provided" })
    const data: Summary = req.body
    const newSummary = await prisma.summary.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        draft: false,
        hidden: data.hidden,
        data: data.data
      }
    })
    return res.status(200).json({ status: "success", data: newSummary })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}