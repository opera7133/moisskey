import Link from "next/link";
import { differenceInHours } from "date-fns";
import { cut } from "@/lib/cut";

export default function Topic({
  id,
  avatar,
  img,
  title,
  pv,
  published,
}: {
  id: string;
  avatar?: string;
  img?: string;
  title: string;
  pv: number;
  published: Date;
}) {
  return (
    <div className="pt-2">
      <Link href={`/li/${id}`} className="group flex gap-2">
        {img && (
          <img
            alt={title}
            src={img}
            className="w-20 h-20 object-cover"
            referrerPolicy="no-referrer"
          />
        )}
        <div>
          <h3 className="group-hover:text-lime-500 duration-100">
            {cut(title, 58)}
          </h3>
          <div className="mt-1 flex flex-row gap-2 items-center">
            <div>
              <img
                src={avatar}
                alt="avatar"
                width={26}
                height={26}
                className="rounded"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-bold">
              {pv} <span className="font-normal text-sm text-gray-500">pv</span>
            </span>
            {differenceInHours(new Date(), new Date(published)) <= 7 && (
              <div className="bg-amber-400 text-white rounded-full text-xs px-1.5 py-0.5">
                New
              </div>
            )}
          </div>
        </div>
      </Link>
      <hr className="my-3" />
    </div>
  );
}
