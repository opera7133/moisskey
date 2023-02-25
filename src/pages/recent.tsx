import Layout from "@/components/Layout";
import Topic from "@/components/Topic";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { GetServerSidePropsContext } from "next";
import NextHeadSeo from "next-head-seo";
import Link from "next/link";
import { MdArrowForwardIos } from "react-icons/md";
import Paginator from "@/components/Paginator";
type SummariesWithUser = Prisma.SummaryGetPayload<{
  include: {
    user: true;
  };
}>;
export default function Recent({
  page,
  summaries,
}: {
  page: number;
  summaries: SummariesWithUser[];
}) {
  return (
    <Layout>
      <NextHeadSeo
        title={`新着のまとめ${page !== 1 && ` (${page}ページ目)`} - Moisskey`}
        description="新たに作成されたまとめをお知らせします。"
        og={{
          title: `新着のまとめ${page !== 1 && ` (${page}ページ目)`}`,
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
            <Link
              className="text-blue-500 duration-100 hover:underline hover:text-blue-600"
              href="/recent"
            >
              新着のまとめ
            </Link>
          </li>
        </ul>
      </header>
      <h1 className="text-3xl font-semibold my-4">
        新着のまとめ{page !== 1 && ` (${page}ページ目)`}
      </h1>
      <p className="text-sm mb-4">新たに作成されたまとめをお知らせします。</p>
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
      {summaries.length > 25 && (
        <Paginator
          type="recent"
          page={page}
          length={summaries.length > 1400 ? 1400 : summaries.length}
        />
      )}
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const page = Number(ctx.query.page) || 1;
  const summary = await prisma.summary.findMany({
    where: {
      draft: false,
      hidden: "PUBLIC",
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * 25,
    take: 25,
  });
  const data = JSON.parse(JSON.stringify(summary));
  return {
    props: {
      page: page,
      summaries: data,
    },
  };
};
