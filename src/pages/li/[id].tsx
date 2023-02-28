import Layout from "@/components/Layout";
import Embed from "@/components/list/Embed";
import MImage from "@/components/list/Image";
import Note from "@/components/list/Note";
import Text from "@/components/list/Text";
import { prisma } from "@/lib/prisma";
import { DataTypeNullable } from "@/types/note";
import { Prisma } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import NextHeadSeo from "next-head-seo";
import Link from "next/link";
import { FaComment, FaStar, FaUserAlt } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/atoms";
import {
  format,
  getDate,
  getMonth,
  getYear,
  differenceInHours,
  formatDistanceToNow,
} from "date-fns";
import { ja } from "date-fns/locale";
import { MdArrowForwardIos } from "react-icons/md";
import SummaryDropDown from "@/components/SummaryDropDown";
import toast from "react-hot-toast";
import SummaryUserDropDown from "@/components/SummaryUserDropDown";
import { useRouter } from "next/router";
import { setup } from "@/lib/csrf";
import Comment from "@/components/list/Comment";
import { getPV } from "../api/utils/pageViews";
import jwt from "jsonwebtoken";
import Video from "@/components/list/Video";
import Internal from "@/components/list/Internal";
import MDelete from "@/components/list/Delete";

type SummaryWithSomeOthers = Prisma.SummaryGetPayload<{
  include: {
    user: true;
    comments: {
      include: {
        user: true;
        replyFrom: true;
        replyTo: {
          include: {
            user: true;
          };
        };
        likedBy: true;
      };
    };
    favorites: true;
    tags: {
      include: {
        tags: true;
      };
    };
  };
}>;

export default function GetSummary({
  pv,
  page,
  userId,
  summary,
  faved,
}: {
  pv: string;
  page: number;
  userId: string;
  summary: SummaryWithSomeOthers;
  faved: boolean;
}) {
  const [user] = useAtom(userAtom);
  const [comments, setComments] = useState(summary.comments);
  const [content, setContent] = useState("");
  const [favs, setFavs] = useState({
    faved: faved,
    count: summary.favorites.length,
  });
  const router = useRouter();
  const makeFav = async (sid: number) => {
    if (user) {
      if (favs.faved) {
        const res = await (
          await fetch("/api/summary/removeFavorite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ summaryId: sid }),
          })
        ).json();
        if (res.status === "success") {
          setFavs({ faved: false, count: favs.count - 1 });
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await (
          await fetch("/api/summary/addFavorite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ summaryId: sid }),
          })
        ).json();
        if (res.status === "success") {
          setFavs({ faved: true, count: favs.count + 1 });
        } else {
          toast.error(res.error);
        }
      }
    } else {
      toast.error("ログインしていません");
    }
  };
  const deleteSummary = async (sid: number) => {
    const chk = confirm("まとめを削除します。よろしいですか？");
    if (chk) {
      const res = await (
        await fetch("/api/summary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ summaryId: sid }),
        })
      ).json();
      if (res.status === "success") {
        router.push("/");
      } else {
        toast.error(res.error);
      }
    }
  };
  const postComment = async () => {
    const res = await (
      await fetch("/api/comments/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summaryId: summary.id, content: content }),
      })
    ).json();
    if (res.status === "success") {
      setContent("");
      setComments([...comments, res.data]);
    } else {
      toast.error(res.error);
    }
  };
  const likeComment = async (id: string, liked: boolean) => {
    const res = await (
      await fetch("/api/comments/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: id, liked: liked }),
      })
    ).json();
    if (res.status !== "success") {
      toast.error(res.error);
    }
  };
  const deleteComment = async (id: string) => {
    const chk = confirm("コメントを削除します。よろしいですか？");
    if (chk) {
      const res = await (
        await fetch("/api/comments/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentId: id }),
        })
      ).json();
      if (res.status !== "success") {
        toast.error(res.error);
      } else {
        toast.success("コメントを削除しました");
        setComments(comments.filter((comment) => comment.id !== id));
      }
    }
  };
  const getComment = async () => {
    const res = await (
      await fetch("/api/comments/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summaryId: summary.id }),
      })
    ).json();
    if (res.status === "success") {
      setComments(res.data);
    } else {
      toast.error(res.error);
    }
  };
  const addReply = (replyId: string) => {
    setContent(`[${replyId}] ${content}`);
  };
  const data = JSON.parse(JSON.stringify(summary.data as Prisma.JsonArray));
  let tags: any[] = [];
  if (summary.tags) {
    tags = summary.tags.map((tag: any) => ({
      id: tag.tags.id,
      name: tag.tags.name,
    }));
  }
  return (
    <Layout tab={true}>
      <NextHeadSeo
        title={`${summary.title} - Moisskey`}
        description={summary.description || ""}
        robots="index, follow"
        og={{
          title: summary.title,
          description: summary.description || "",
          image: `${process.env.NEXT_PUBLIC_SITE_URL}/img/ogp.png`,
          type: "article",
          siteName: "Moisskey",
        }}
      />
      {summary &&
      (summary.hidden !== "PRIVATE" || summary.userId === userId) ? (
        <>
          <article className="my-2">
            <header className="relative">
              <div className="flex justify-between items-center text-xs my-3">
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
                      href={`/${getYear(new Date(summary.createdAt))}`}
                    >
                      {getYear(new Date(summary.createdAt))}年
                    </Link>
                  </li>
                  <li className="flex gap-1 items-center">
                    <MdArrowForwardIos size={10} className="mt-0.5" />
                    <Link
                      className="text-blue-500 duration-100 hover:underline hover:text-blue-600"
                      href={`/${format(
                        new Date(summary.createdAt),
                        "yyyy/MM"
                      )}`}
                    >
                      {getMonth(new Date(summary.createdAt)) + 1}月
                    </Link>
                  </li>
                  <li className="flex gap-1 items-center">
                    <MdArrowForwardIos size={10} className="mt-0.5" />
                    <Link
                      className="text-blue-500 duration-100 hover:underline hover:text-blue-600"
                      href={`/${format(
                        new Date(summary.createdAt),
                        "yyyy/MM/dd"
                      )}`}
                    >
                      {getDate(new Date(summary.createdAt))}日
                    </Link>
                  </li>
                </ul>
                <div className="relative flex items-center gap-1">
                  {differenceInHours(new Date(), new Date(summary.createdAt)) <=
                    7 && (
                    <div className="bg-amber-400 text-white rounded-full text-xs px-1.5 py-0.5">
                      New
                    </div>
                  )}
                  <span className="text-gray-500">
                    {formatDistanceToNow(new Date(summary.createdAt), {
                      locale: ja,
                    })}
                    前
                  </span>
                  {user?.id === summary.userId && user ? (
                    <SummaryUserDropDown
                      summaryId={summary.id}
                      deleteSummary={() => deleteSummary(summary.id)}
                    />
                  ) : (
                    user && (
                      <SummaryDropDown
                        summaryId={summary.id}
                        summaryData={summary.data}
                        makeFav={() => makeFav(summary.id)}
                      />
                    )
                  )}
                </div>
              </div>
              <div className="flex">
                <div className="w-full">
                  <Link href={`/li/${summary.id}`}>
                    <h1 className="font-bold text-3xl duration-100 hover:text-lime-500">
                      {summary.title}
                    </h1>
                  </Link>
                  <p className="my-4 text-sm text-gray-500">
                    {summary.description}
                  </p>
                </div>
                {summary.thumbnail && (
                  <img
                    src={summary.thumbnail}
                    className="w-28 h-28 object-cover"
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-1 text-sm">
                {tags.length !== 0 &&
                  tags.map((tag) => (
                    <Link
                      className="bg-gray-200 px-2 py-1 duration-100 hover:bg-gray-100 rounded"
                      href={`/t/${tag.name}`}
                      key={tag.id}
                    >
                      {tag.name}
                    </Link>
                  ))}
              </div>
              <div className="text-sm flex items-center gap-1 my-4">
                <Link
                  href={`/id/${summary.user.username}`}
                  className="flex items-center gap-1 group pr-7"
                >
                  <img
                    src={summary.user.avatar || ""}
                    className="rounded-full w-7"
                  />
                  <div className="duration-100 text-blue-500 group-hover:text-blue-700 group-hover:underline">
                    {summary.user.username}
                  </div>
                </Link>
                <span className="flex items-center gap-1">
                  <FaUserAlt size={15} className="fill-lime-500" />
                  <p className="font-bold">{pv}</p>
                </span>
                <a
                  href="#comments"
                  className="hover:underline flex items-center gap-1"
                >
                  <FaComment size={15} className="fill-lime-500" />
                  <p className="font-bold">{comments.length}</p>
                </a>
                <div className="w-full"></div>
                <button
                  onClick={async () => await makeFav(summary.id)}
                  className={twMerge(
                    "border border-gray-200 p-2 rounded-full duration-100 group hover:border-lime-500",
                    favs.faved && "border-lime-500"
                  )}
                >
                  <FaStar
                    size={20}
                    className={twMerge(
                      "fill-gray-200 duration-100 group-hover:fill-lime-500",
                      favs.faved && "fill-lime-500"
                    )}
                  />
                </button>
                <p className="font-bold">{favs.count}</p>
              </div>
            </header>
            <div id="notes" className="my-4">
              {data.map((value: DataTypeNullable) => {
                if (!value) {
                  return null;
                } else if (value.type === "note") {
                  return <Note key={value.id} id={value.id} note={value} />;
                } else if (value.type === "image") {
                  return <MImage key={value.id} data={value} />;
                } else if (value.type === "text") {
                  return <Text key={value.id} data={value} />;
                } else if (value.type === "video") {
                  return <Video key={value.id} data={value} />;
                } else if (value.type === "url") {
                  return <Embed key={value.id} data={value} />;
                } else if (value.type === "internal") {
                  return <Internal key={value.id} data={value} />;
                } else {
                  return <MDelete key={value.id} data={value} />;
                }
              })}
            </div>
            {data.length > 25 && (
              <div className="flex gap-1 items-center justify-center text-gray-600 font-bold">
                {(() => {
                  const pages = [];
                  if (page !== 1) {
                    pages.push(
                      <Link
                        className="border border-gray-200 px-2 rounded-md py-1 duration-100 hover:bg-gray-100"
                        href={`/li/${summary.id}?page=${page - 1}`}
                      >
                        前へ
                      </Link>
                    );
                  }
                  for (let i = 1; i < Math.ceil(data.length / 25) + 1; i++) {
                    if (i > 1) {
                      pages.push(
                        <Link
                          className={twMerge(
                            "border border-gray-200 px-2 rounded-md py-1 duration-100 hover:bg-gray-100",
                            page === i && "bg-gray-100"
                          )}
                          href={`/li/${summary.id}?page=${i}`}
                        >
                          {i}
                        </Link>
                      );
                    } else {
                      pages.push(
                        <Link
                          className={twMerge(
                            "border border-gray-200 px-2 rounded-md py-1 duration-100 hover:bg-gray-100",
                            page === i && "bg-gray-100"
                          )}
                          href={`/li/${summary.id}`}
                        >
                          {i}
                        </Link>
                      );
                    }
                  }
                  if (page !== Math.ceil(data.length / 25)) {
                    pages.push(
                      <Link
                        className="border border-gray-200 px-2 rounded-md py-1 duration-100 hover:bg-gray-100"
                        href={`/li/${summary.id}?page=${page + 1}`}
                      >
                        次へ
                      </Link>
                    );
                  }
                  return pages;
                })()}
              </div>
            )}
          </article>
          <div id="comments" className="text-sm mb-8">
            <h4 className="inline-block pr-2 font-medium border-b-2 border-lime-500">
              コメント
            </h4>
            {comments.length === 0 ? (
              <div className="mx-auto my-12 text-center">
                <p>コメントがまだありません。感想を最初に伝えてみませんか？</p>
              </div>
            ) : (
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  data={comment}
                  like={likeComment}
                  reply={addReply}
                  deleteComment={deleteComment}
                  user={user}
                />
              ))
            )}
            <button
              onClick={async () => await getComment()}
              className="my-4 mx-auto block bg-gray-100 px-12 py-2 rounded-full duration-100 hover:bg-gray-200"
            >
              新しいコメントを読む
            </button>
            {user && (
              <div className="my-8 flex items-start gap-1">
                <img src={user.avatar || ""} className="w-12 rounded" />
                <div className="w-full flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-bold">
                    {user.name}{" "}
                    <span className="font-normal">@{user.username}</span>
                  </span>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="コメントを入力"
                    className="text-md w-full rounded py-1 px-2 focus:border-lime-500 focus:ring-lime-500"
                    rows={4}
                  ></textarea>
                  <button
                    onClick={async () => await postComment()}
                    className="bg-lime-500 text-white ml-auto px-4 py-1.5 rounded duration-100 hover:bg-lime-600"
                  >
                    コメントする
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="py-2.5 px-4 bg-lime-200 rounded my-8 text-sm text-lime-600">
          <p>
            このまとめは、すでに削除されているか公開先が限定されている可能性があります。
          </p>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps = setup(
  async (ctx: GetServerSidePropsContext) => {
    const summary = await prisma.summary.findUnique({
      where: {
        id: Number(ctx.query.id),
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
            replyFrom: true,
            replyTo: {
              include: {
                user: true,
              },
            },
            likedBy: true,
          },
        },
        favorites: true,
        tags: {
          include: {
            tags: true,
          },
        },
      },
    });
    const data = JSON.parse(JSON.stringify(summary));

    if (!summary) {
      return {
        notFound: true,
      };
    }

    const pv = await getPV("2023-02-01", `/li/${ctx.query.id?.toString()}`);
    if (pv !== "0") {
      await prisma.summary.update({
        where: {
          id: summary.id,
        },
        data: {
          pageviews: Number(pv),
        },
      });
    }
    let faved = false;
    const jwtToken =
      getCookie("mi-auth.token", { req: ctx.req, res: ctx.res })?.toString() ||
      "";
    let userId = "";
    if (jwtToken) {
      //@ts-ignore
      const { uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY);
      userId = uid;
      faved = summary.favorites?.find((fav) => fav?.userId === uid)
        ? true
        : false;
    }

    return {
      props: {
        pv: pv,
        userId: userId,
        page: ctx.query.page || 1,
        summary: data,
        faved: faved || false,
      },
    };
  }
);
