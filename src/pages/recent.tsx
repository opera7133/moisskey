import Layout from "@/components/Layout";
import Topic from "@/components/Topic";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { GetServerSidePropsContext } from "next";
import NextHeadSeo from "next-head-seo";
import { setup } from "@/lib/csrf";
type SummariesWithUser = Prisma.SummaryGetPayload<{
  include: {
    user: true;
  };
}>;
export default function Recent({
  summaries,
}: {
  summaries: SummariesWithUser[];
}) {
  return (
    <Layout>
      <NextHeadSeo
        title="新着のまとめ - Moisskey"
        description="新たに作成されたまとめをお知らせします。"
        og={{
          title: "新着のまとめ",
          type: "article",
          description: "新たに作成されたまとめをお知らせします。",
          siteName: "Moisskey",
        }}
      />
      <h1 className="text-3xl font-semibold my-4">新着のまとめ</h1>
      {summaries.length !== 0 ? (
        summaries.map((summary) => (
          <Topic
            id={summary.id.toString()}
            avatar={summary.user.avatar || ""}
            key={summary.id}
            title={summary.title}
            pv={0}
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
        hidden: false,
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
      },
    };
  }
);
