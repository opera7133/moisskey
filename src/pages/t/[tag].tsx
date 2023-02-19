import Layout from "@/components/Layout";
import Topic from "@/components/Topic";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { GetServerSidePropsContext } from "next";
import NextHeadSeo from "next-head-seo";
import { MdArrowForwardIos } from "react-icons/md";
import Link from "next/link";
import { setup } from "@/lib/csrf";
type SummariesWithUser = Prisma.SummaryGetPayload<{
  include: {
    user: true;
  };
}>;
export default function Recent({
  tagName,
  summaries,
}: {
  tagName: string;
  summaries: SummariesWithUser[];
}) {
  return (
    <Layout>
      <NextHeadSeo
        title={`${tagName}に関連する${summaries.length}件のまとめ - Moisskey`}
        description="新たに作成されたまとめをお知らせします。"
        og={{
          title: `${tagName}に関連する${summaries.length}件のまとめ`,
          type: "article",
          image: `${process.env.NEXT_PUBLIC_SITE_URL}/img/ogp.png`,
          description: "新たに作成されたまとめをお知らせします。",
          siteName: "Moisskey",
        }}
      />
      <header className="text-xs my-4">
        <ul className="flex gap-1 items-center list-none">
          <li>
            <Link
              href="/"
              className="text-blue-500 duration-100 hover:underline hover:text-blue-600"
            >
              トップ
            </Link>
          </li>
          <li className="flex gap-1 items-center">
            <MdArrowForwardIos size={10} className="mt-0.5" />
            <a
              className="text-blue-500 duration-100 hover:underline hover:text-blue-600"
              href="#"
            >
              タグ
            </a>
          </li>
          <li className="flex gap-1 items-center">
            <MdArrowForwardIos size={10} className="mt-0.5" />
            <Link
              className="text-blue-500 duration-100 hover:underline hover:text-blue-600"
              href={`/t/${tagName}`}
            >
              {tagName}
            </Link>
          </li>
        </ul>
      </header>
      <h1 className="text-3xl font-semibold my-4">{`${tagName}に関連する${summaries.length}件のまとめ`}</h1>
      {summaries.map((summary) => (
        <Topic
          id={summary.id.toString()}
          avatar={summary.user.avatar || ""}
          key={summary.id}
          img={summary.thumbnail || ""}
          title={summary.title}
          pv={0}
          published={summary.createdAt}
        />
      ))}
    </Layout>
  );
}

export const getServerSideProps = setup(
  async (ctx: GetServerSidePropsContext) => {
    const tagName = ctx.query.tag?.toString();
    const tag = await prisma.tags.findUnique({
      where: {
        name: tagName,
      },
      include: {
        summaries: {
          include: {
            summary: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    if (!tag) {
      return {
        notFound: true,
      };
    }
    const summaries = tag?.summaries.map((summary) => summary.summary);
    const data = JSON.parse(JSON.stringify(summaries));
    return {
      props: {
        tagName: tagName,
        summaries: data,
      },
    };
  }
);
