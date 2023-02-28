import { InternalType } from "@/types/note";
import { FaArrowDown, FaArrowUp, FaTimes } from "react-icons/fa";
import { useAtom } from "jotai";
import { activesAtom } from "@/lib/atoms";
import Link from "next/link";
import { format } from "date-fns";
import { cut } from "@/lib/cut";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useSortable } from "@dnd-kit/sortable";
import { twMerge } from "tailwind-merge";

export default function Internal({
  mkey,
  data,
}: {
  mkey: string;
  data: InternalType;
}) {
  const [width, height] = useWindowSize();
  const [actives, setActives] = useAtom(activesAtom);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: mkey,
      data: data,
      disabled: width < 1024,
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  function moveUp(nid: string) {
    const target = actives.findIndex((at) => at.id === nid);
    const targetElm = actives[target];
    const replaceElm = target === 0 ? actives[target] : actives[target - 1];
    setActives(
      actives.map((nt, i) => {
        if (i === target) return replaceElm;
        if (i === target - 1) return targetElm;
        return nt;
      })
    );
  }
  function moveDown(nid: string) {
    const target = actives.findIndex((at) => at.id === nid);
    const targetElm = actives[target];
    const replaceElm =
      target === actives.length - 1 ? actives[target] : actives[target + 1];
    setActives(
      actives.map((nt, i) => {
        if (i === target) return replaceElm;
        if (i === target + 1) return targetElm;
        return nt;
      })
    );
  }
  function deleteFrom(nid: string) {
    setActives(
      actives.filter((at) => {
        if (at.type === "internal") return at.id !== nid;
        return true;
      })
    );
  }
  return (
    <div
      className={twMerge("bg-white z-50", isDragging && "invisible")}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="flex gap-2 pl-2 my-2 text-sm relative" key={mkey}>
        <div className="py-4 h-24 w-24 aspect-square flex items-center gap-4">
          {data.thumbnail && (
            <img
              src={data.thumbnail}
              className="h-24 w-24 aspect-square"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
        <div className="w-full">
          <Link
            href={`/li/${data.id}`}
            className="duration-100 hover:underline hover:text-lime-500"
          >
            <h3>{cut(data.title, 58)}</h3>
          </Link>
          <div className="mt-1 flex flex-row gap-2 items-center">
            <div>
              <img
                src={data.userAvatar}
                alt="avatar"
                width={26}
                height={26}
                className="rounded"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-bold">
              {data.pv}{" "}
              <span className="font-normal text-sm text-gray-500">pv</span>
            </span>
          </div>
          <div className="flex flex-wrap justify-between text-xs text-gray-600 mt-3">
            <span>{data.username}</span>
            <Link
              href={`/li/${data.id}`}
              className="duration-100 hover:text-lime-500"
            >
              <span>
                {format(new Date(data.createdAt), "yyyy-MM-dd kk:mm:ss")}
              </span>
            </Link>
          </div>
        </div>
        <button
          className="hidden lg:block absolute top-1 right-1 group"
          onClick={() => deleteFrom(data.id)}
        >
          <FaTimes
            size={20}
            className="fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
          />
        </button>
        <div className="flex flex-col gap-1 items-center px-1 pt-2 lg:hidden">
          <button className="group" onClick={() => deleteFrom(data.id)}>
            <FaTimes
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
          <button className="group" onClick={() => moveUp(data.id)}>
            <FaArrowUp
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
          <button className="group" onClick={() => moveDown(data.id)}>
            <FaArrowDown
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
        </div>
      </div>
      <hr className="border-dotted" />
    </div>
  );
}
