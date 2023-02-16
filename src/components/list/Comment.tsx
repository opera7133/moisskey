import { Prisma } from "@prisma/client";
import { IoMdThumbsUp } from "react-icons/io";
import { MdOutlineReply } from "react-icons/md";
import { twMerge } from "tailwind-merge";
type CommentWithUser = Prisma.CommentsGetPayload<{
  include: {
    replyFrom: true;
    replyTo: true;
    user: true;
    likedBy: true;
  };
}>;
export default function Comment({ data }: { data: CommentWithUser }) {
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
            <button className="group flex items-center gap-0.5">
              <IoMdThumbsUp
                size={18}
                className="duration-100 fill-gray-400 group-hover:fill-lime-500"
              />
              <span className="text-lime-600 text-xs">
                {data.likedBy.length}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
