import { GetServerSidePropsContext } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import NextHeadSeo from "next-head-seo";
import Topic from "@/components/Topic";
import { MdArrowForwardIos } from "react-icons/md";
import Link from "next/link";
import Paginator from "@/components/Paginator";
type SummariesWithUser = Prisma.SummaryGetPayload<{
  include: {
    user: true;
  };
}>;
export default function GetByYear({
  page,
  year,
  summaries,
}: {
  page: number;
  year: string;
  summaries: SummariesWithUser[];
}) {
  return (
    <Layout>
      <NextHeadSeo
        title={`${year}年のノートまとめ - Moisskey`}
        description={`${year}年のノートまとめを新着順に並べています。`}
        og={{
          title: `${year}年のノートまとめ`,
          type: "article",
          image: `${process.env.NEXT_PUBLIC_SITE_URL}/img/ogp.png`,
          description: `${year}年のノートまとめを新着順に並べています。`,
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
            <Link
              className="text-blue-500 duration-100 hover:underline hover:text-blue-600"
              href={`/${year}`}
            >
              {year}年
            </Link>
          </li>
        </ul>
      </header>
      <h1 className="text-3xl font-semibold my-4">{year}年のノートまとめ</h1>
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
          type={year}
          page={page}
          length={summaries.length > 1400 ? 1400 : summaries.length}
        />
      )}
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const page = Number(ctx.query.page) || 1;
  if (!ctx.query.year || !/^(19|20)\d{2}$/.test(ctx.query.year.toString())) {
    return {
      notFound: true,
    };
  }
  const summary = await prisma.summary.findMany({
    where: {
      draft: false,
      hidden: "PUBLIC",
      createdAt: {
        gte: new Date("${ctx.query.year}-01-01"),
        lt: new Date(`${ctx.query.year}-12-31`),
      },
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
  if (!summary) {
    return {
      notFound: true,
    };
  }
  const data = JSON.parse(JSON.stringify(summary));
  return {
    props: {
      page: page,
      year: ctx.query.year || "",
      summaries: data,
    },
  };
}
