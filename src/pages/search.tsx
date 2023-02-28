import Layout from "@/components/Layout";
import { setup } from "@/lib/csrf";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { GetServerSidePropsContext } from "next";
import NextHeadSeo from "next-head-seo";
import Topic from "@/components/Topic";
import Link from "next/link";
import { MdArrowForwardIos } from "react-icons/md";
type SummariesWithUser = Prisma.SummaryGetPayload<{
  include: {
    user: true;
  };
}>;
export default function searchSummaries({
  summaries,
  text,
  sort,
}: {
  summaries: SummariesWithUser[];
  text: string;
  sort?: string;
}) {
  return (
    <Layout>
      <NextHeadSeo
        title={`「${text}」の検索結果 - Moisskey`}
        description={`まとめの中から「${text}」の検索結果を表示しています。`}
        og={{
          title: `「${text}」の検索結果`,
          type: "article",
          image: `${process.env.NEXT_PUBLIC_SITE_URL}/img/ogp.png`,
          description: `まとめの中から「${text}」の検索結果を表示しています。`,
          siteName: "Moisskey",
        }}
        twitter={{
          card: "summary_large_image",
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
              「{text}」の検索結果
            </a>
          </li>
        </ul>
      </header>
      <h1 className="text-3xl font-semibold my-4">
        <Link
          className="duration-100 hover:text-lime-500"
          href={`/search?q=${text}${sort && `&sort=${sort}`}`}
        >
          「{text}」の検索結果
        </Link>
      </h1>
      <p className="text-sm mb-4">
        まとめの中から「{text}」の検索結果を表示しています。
      </p>
      {summaries.length !== 0 ? (
        summaries.map((summary) => (
          <Topic
            id={summary.id.toString()}
            avatar={summary.user.avatar || ""}
            key={summary.id}
            title={summary.title}
            img={summary.thumbnail || ""}
            pv={summary.pageviews}
            published={summary.createdAt}
          />
        ))
      ) : (
        <div className="py-2.5 px-4 bg-lime-200 rounded my-8 text-sm text-lime-600">
          <p>該当するまとめがありません。</p>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps = setup(
  async (ctx: GetServerSidePropsContext) => {
    const summary = await prisma.summary.findMany({
      where: {
        draft: false,
        hidden: "PUBLIC",
        title: {
          contains: ctx.query.q?.toString(),
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    const data = JSON.parse(JSON.stringify(summary));
    return {
      props: {
        summaries: data,
        text: ctx.query.q,
        sort: ctx.query.sort || "",
      },
    };
  }
);
