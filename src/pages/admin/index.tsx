import Layout from "@/components/admin/Layout";
import { User, Prisma } from "@prisma/client";
import NextHeadSeo from "next-head-seo";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
type ReportsWithUserAndSummary = Prisma.ReportsGetPayload<{
  include: {
    summary: true;
    user: true;
  };
}>;

export default function AdminHome({
  user,
  reports,
}: {
  user: User;
  reports: ReportsWithUserAndSummary[];
}) {
  const [reason, setReason] = useState("");
  const [reasons, setReasons] = useState("");
  const convertNum = () => {
    if (reason.length === 10 && /^[01]+$/.test(reason)) {
      const strReason = [
        "ノートや情報を不適切な形で引用する行為",
        "悪質な商品やサービスへの誘導・宣伝を目的とする行為",
        "個人情報の掲載、収集を目的とする行為",
        "閲覧に適さない画像の掲載",
        "不当な差別や誹謗中傷をする行為",
        "法令、公序良俗に反するおそれのある行為",
        "第三者になりすます行為",
        "タイトルと内容の不一致",
        "虚偽又は誤解を招く情報や行為",
        "コメント欄にて発生している問題",
      ];
      const arr = Array.from(reason);
      setReasons(
        arr
          .map((rs, i) => (rs === "1" ? strReason[i] : undefined))
          .filter(Boolean)
          .join("\n")
      );
    }
  };
  return (
    <Layout>
      <NextHeadSeo title="管理コンソール - Moisskey" />
      <h2 className="text-3xl font-bold my-4">理由変換</h2>
      <div className="flex">
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="0000000000"
          className="rounded-l focus:border-lime-500 focus:ring-lime-500"
        />
        <button
          onClick={() => convertNum()}
          className="rounded-r px-4 bg-lime-500 duration-100 hover:bg-lime-600 text-white"
        >
          変換
        </button>
      </div>
      <textarea value={reasons} disabled className="my-4 w-full"></textarea>
      <h2 className="text-3xl font-bold my-4">報告一覧</h2>
      {!reports || reports.length === 0 ? (
        <div className="my-4 text-lg">報告はありませんでした！</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>報告ユーザー</th>
              <th>まとめ名</th>
              <th>作成者</th>
              <th>理由</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, i) => (
              <tr key={report.id}>
                <td>{report.userId}</td>
                <td>{report.summary.title}</td>
                <td>{report.summary.userId}</td>
                <td>
                  {JSON.parse(JSON.stringify(report.reason)).map(
                    (rs: boolean) => (rs === true ? 1 : 0)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const jwtToken = getCookie("mi-auth.token", { req, res });
  if (!jwtToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  //@ts-ignore
  const { uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY);
  const user = await prisma.user.findUnique({
    where: {
      id: uid,
    },
  });
  const summary = await prisma.reports.findMany({
    include: {
      user: true,
      summary: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  if (!user || !user.isAdmin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      reports: JSON.parse(JSON.stringify(summary)),
    },
  };
}
