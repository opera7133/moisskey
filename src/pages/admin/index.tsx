import Layout from "@/components/admin/Layout";
import { User, Prisma } from "@prisma/client";
import NextHeadSeo from "next-head-seo";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import Link from "next/link";
import { setup } from "@/lib/csrf";
import toast from "react-hot-toast";
type ReportsWithUserAndSummary = Prisma.ReportsGetPayload<{
  include: {
    summary: {
      include: {
        user: true;
      };
    };
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
  const setResolved = async (id: string) => {
    const d = await (
      await fetch("/api/admin/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: id }),
      })
    ).json();
    if (d.error) {
      toast.error(d.error);
    } else {
      toast.success("報告を解決済みにしました");
    }
  };
  const hideSummary = async (id: string, sid: string) => {
    const d = await (
      await fetch("/api/admin/hide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summaryId: sid }),
      })
    ).json();
    if (d.error) {
      toast.error(d.error);
    } else {
      setResolved(id);
      toast.success("まとめを非公開にしました");
    }
  };
  const suspendUser = async (id: string, uid: string) => {
    const d = await (
      await fetch("/api/admin/suspend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid }),
      })
    ).json();
    if (d.error) {
      toast.error(d.error);
    } else {
      setResolved(id);
      toast.success("ユーザーを停止しました");
    }
  };
  const notresolved = reports.filter((report) => report.resolved === false);
  const resolved = reports.filter((report) => report.resolved === true);
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
      {!notresolved || notresolved.length === 0 ? (
        <div className="my-4 text-lg">報告はありませんでした！</div>
      ) : (
        <table className="">
          <thead className="bg-lime-500 text-white">
            <tr>
              <th className="p-2">報告ユーザー</th>
              <th className="p-2">まとめ名</th>
              <th className="p-2">作成者</th>
              <th className="p-2">理由</th>
              <th className="p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {notresolved.map((report, i) => (
              <tr key={report.id}>
                <td className="p-2 text-blue-500 duration-100 hover:text-blue-600 hover:underline">
                  <Link href={`/id/${report.user.username}`}>
                    {report.user.username}
                  </Link>
                </td>
                <td className="p-2 text-blue-500 duration-100 hover:text-blue-600 hover:underline">
                  <Link href={`/li/${report.summaryId}`}>
                    {report.summary.title}
                  </Link>
                </td>
                <td className="p-2 text-blue-500 duration-100 hover:text-blue-600 hover:underline">
                  <Link href={`/id/${report.summary.user.username}`}>
                    {report.summary.user.username}
                  </Link>
                </td>
                <td className="p-2">{report.reason}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={async () => await setResolved(report.id)}
                    className="px-2 py-1 rounded bg-gray-200 duration-100 hover:bg-gray-300"
                  >
                    解決済み
                  </button>
                  <button
                    onClick={async () =>
                      await hideSummary(report.id, report.summary.id.toString())
                    }
                    className="px-2 py-1 rounded bg-gray-200 duration-100 hover:bg-gray-300"
                  >
                    まとめ非公開
                  </button>
                  <button
                    onClick={async () =>
                      await suspendUser(report.id, report.summary.userId)
                    }
                    className="px-2 py-1 rounded bg-gray-200 duration-100 hover:bg-gray-300"
                  >
                    ユーザー停止
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h2 className="text-3xl font-bold my-4">解決済み</h2>
      {!resolved || resolved.length === 0 ? (
        <div className="my-4 text-lg">報告はありませんでした！</div>
      ) : (
        <table className="">
          <thead className="bg-lime-500 text-white">
            <tr>
              <th className="p-2">報告ユーザー</th>
              <th className="p-2">まとめ名</th>
              <th className="p-2">作成者</th>
              <th className="p-2">理由</th>
            </tr>
          </thead>
          <tbody>
            {resolved.map((report, i) => (
              <tr key={report.id}>
                <td className="p-2 text-blue-500 duration-100 hover:text-blue-600 hover:underline">
                  <Link href={`/id/${report.user.username}`}>
                    {report.user.username}
                  </Link>
                </td>
                <td className="p-2 text-blue-500 duration-100 hover:text-blue-600 hover:underline">
                  <Link href={`/li/${report.summaryId}`}>
                    {report.summary.title}
                  </Link>
                </td>
                <td className="p-2 text-blue-500 duration-100 hover:text-blue-600 hover:underline">
                  <Link href={`/id/${report.summary.user.username}`}>
                    {report.summary.user.username}
                  </Link>
                </td>
                <td className="p-2">{report.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export const getServerSideProps = setup(
  async ({ req, res }: GetServerSidePropsContext) => {
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
        summary: {
          include: {
            user: true,
          },
        },
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
);
