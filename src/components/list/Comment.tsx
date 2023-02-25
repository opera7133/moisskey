import { Prisma, User } from "@prisma/client";
import { IoMdThumbsUp } from "react-icons/io";
import { FaComment } from "react-icons/fa";
import { MdOutlineReply, MdDelete } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import reactStringReplace from "react-string-replace";
import Link from "next/link";
type CommentWithUser = Prisma.CommentsGetPayload<{
  include: {
    replyFrom: true;
    replyTo: {
      include: {
        user: true;
      };
    };
    user: true;
    likedBy: true;
  };
}>;
export default function Comment({
  data,
  like,
  user,
  reply,
  deleteComment,
}: {
  data: CommentWithUser;
  like: any;
  user?: User | null;
  reply: any;
  deleteComment: any;
}) {
  const [likeData, setLikeData] = useState({
    count: data.likedBy.length,
    liked: false,
  });
  useEffect(() => {
    setLikeData({
      ...likeData,
      liked: data.likedBy.map((liked) => liked.userId).includes(user?.id || ""),
    });
  }, [user]);
  const likeProcess = async (commentId: string, liked: boolean) => {
    await like(commentId, liked);
    if (likeData.liked) {
      setLikeData({ count: likeData.count - 1, liked: false });
    } else {
      setLikeData({ count: likeData.count + 1, liked: true });
    }
  };
  return (
    <div id={data.id} className="flex items-start gap-1 mt-2">
      <img
        className="w-12 rounded"
        src={data.user.avatar || ""}
        referrerPolicy="no-referrer"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = "/img/avatar.png";
        }}
      />
      <div className="w-full flex flex-col gap-1">
        <Link
          href={`/id/${data.user.username}`}
          className="text-xs text-gray-500 font-bold duration-100 hover:text-lime-500"
        >
          {data.user.name}{" "}
          <span className="text-gray-500 font-normal">
            @{data.user.username}
          </span>
        </Link>
        <div className="bg-gray-100 text-md w-full rounded py-1 px-2">
          <p
            className={twMerge(
              data.likedBy.length > 13
                ? "text-red-500 font-bold text-lg"
                : data.likedBy.length > 8
                ? "text-fuchsia-500 font-bold text-md"
                : data.likedBy.length > 4
                ? "text-orange-500 font-bold text-md"
                : data.likedBy.length > 1 && "font-bold text-md"
            )}
          >
            {data.replyTo[0] && (
              <a
                className="text-lime-600 font-bold mr-1"
                href={`#${data.replyTo[0].id}`}
              >
                &gt;&gt;{data.replyTo[0].user.name}
              </a>
            )}
            {data.content}
          </p>
          {user && (
            <div className="ml-auto flex justify-end gap-2">
              {data.replyFrom.length !== 0 && (
                <button className="group flex items-center gap-1">
                  <FaComment
                    size={13}
                    className="duration-100 fill-gray-400 group-hover:fill-lime-500"
                  />
                  <span className="text-lime-600 text-xs">
                    {data.replyFrom.length}
                  </span>
                </button>
              )}
              <button className="group" onClick={() => reply(data.id)}>
                <MdOutlineReply
                  size={18}
                  className="duration-100 fill-gray-400 group-hover:fill-lime-500"
                />
              </button>
              <button
                className="group flex items-center gap-0.5"
                onClick={async () => await likeProcess(data.id, likeData.liked)}
              >
                <IoMdThumbsUp
                  size={18}
                  className={twMerge(
                    "duration-100 fill-gray-400 group-hover:fill-lime-500",
                    likeData.liked && "fill-lime-500"
                  )}
                />
                <span className="text-lime-600 text-xs">{likeData.count}</span>
              </button>
              {(data.userId === user?.id || user?.isAdmin === true) && (
                <button
                  className="group flex items-center gap-0.5"
                  onClick={async () => await deleteComment(data.id)}
                >
                  <MdDelete
                    size={18}
                    className="duration-100 fill-gray-400 group-hover:fill-lime-500"
                  />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
