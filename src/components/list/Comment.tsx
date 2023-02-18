import { Prisma, User } from "@prisma/client";
import { IoMdThumbsUp } from "react-icons/io";
import { MdOutlineReply } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
type CommentWithUser = Prisma.CommentsGetPayload<{
  include: {
    replyFrom: true;
    replyTo: true;
    user: true;
    likedBy: true;
  };
}>;
export default function Comment({
  data,
  like,
  user,
}: {
  data: CommentWithUser;
  like: any;
  user?: User | null;
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
    <div className="flex items-start gap-1 mt-2">
      <img className="w-12 rounded" src={data.user.avatar || ""} />
      <div className="w-full flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-bold">
          {data.user.name}@{data.user.username}
        </span>
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
            {data.content}
          </p>
          <div className="ml-auto flex justify-end gap-2">
            <button className="group">
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
          </div>
        </div>
      </div>
    </div>
  );
}
