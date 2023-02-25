import { GetServerSidePropsContext } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import NextHeadSeo from "next-head-seo";
import Topic from "@/components/Topic";
import { MdArrowForwardIos } from "react-icons/md";
import { format, endOfMonth, startOfMonth, addDays } from "date-fns";
import Link from "next/link";
type SummariesWithUser = Prisma.SummaryGetPayload<{
  include: {
    user: true;
  };
}>;
export default function GetByYear({
  year,
  month,
  date,
  summaries,
}: {
  year: string;
  month: string;
  date: string;
  summaries: SummariesWithUser[];
}) {
  return (
    <Layout>
      <NextHeadSeo
        title={`${format(
          new Date(`${year}-${month}-${date}`),
          "yyyy年M月d日"
        )}のノートまとめ - Moisskey`}
        description={`${format(
          new Date(`${year}-${month}-${date}`),
          "yyyy年M月d日"
        )}のノートまとめを新着順に並べています。`}
        og={{
          title: `${format(
            new Date(`${year}-${month}-${date}`),
            "yyyy年M月d日"
          )}のノートまとめ`,
          type: "article",
          image: `${process.env.NEXT_PUBLIC_SITE_URL}/img/ogp.png`,
          description: `${format(
            new Date(`${year}-${month}-${date}`),
            "yyyy年M月d日"
          )}のノートまとめを新着順に並べています。`,
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
              href={`/${year}`}
            >
              {year}年
            </Link>
          </li>
          <li className="flex gap-1 items-center">
            <MdArrowForwardIos size={10} className="mt-0.5" />
            <Link
              className="text-blue-500 duration-100 hover:underline hover:text-blue-600"
              href={`/${year}/${month}`}
            >
              {format(new Date(`${year}-${month}-01`), "M月")}
            </Link>
          </li>
          <li className="flex gap-1 items-center">
            <MdArrowForwardIos size={10} className="mt-0.5" />
            <Link
              className="text-blue-500 duration-100 hover:underline hover:text-blue-600"
              href={`/${year}/${month}/${date}`}
            >
              {format(new Date(`${year}-${month}-${date}`), "d日")}
            </Link>
          </li>
        </ul>
      </header>
      <h1 className="text-3xl font-semibold my-4">
        {format(new Date(`${year}-${month}-${date}`), "yyyy年M月d日")}
        のノートまとめ
      </h1>
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (
    !ctx.query.year ||
    !ctx.query.month ||
    !ctx.query.date ||
    !/^(19|20)\d{2}$/.test(ctx.query.year.toString()) ||
    !/^(0?[1-9]|1[012])$/.test(ctx.query.month.toString()) ||
    !/^0[1-9]|[12][0-9]|3[01]$/.test(ctx.query.date.toString())
  ) {
    return {
      notFound: true,
    };
  }
  const summary = await prisma.summary.findMany({
    where: {
      draft: false,
      hidden: "PUBLIC",
      createdAt: {
        gte: new Date(`${ctx.query.year}-${ctx.query.month}-${ctx.query.date}`),
        lt: addDays(
          new Date(`${ctx.query.year}-${ctx.query.month}-${ctx.query.date}`),
          1
        ),
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!summary) {
    return {
      notFound: true,
    };
  }
  const data = JSON.parse(JSON.stringify(summary));
  return {
    props: {
      year: ctx.query.year || "",
      month: ctx.query.month || "",
      date: ctx.query.date || "",
      summaries: data,
    },
  };
}
