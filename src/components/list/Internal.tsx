import { cut } from "@/lib/cut";
import { InternalType } from "@/types/note";
import Link from "next/link";

export default function Embed({ data }: { data: InternalType }) {
  return (
    <div className="flex gap-6 items-start px-3 text-sm relative border rounded-lg py-2 my-2 mx-2">
      <div className="w-full">
        <div>
          <div className="flex flex-row items-center gap-1">
            <div className="bg-lime-500 text-white inline-block px-1 py-0.5 rounded">
              まとめ
            </div>
            <div>
              <img
                src={data.userAvatar}
                alt="avatar"
                width={26}
                height={26}
                className="rounded"
              />
            </div>
          </div>
          <Link
            href={`/li/${data.id}`}
            rel="noopener noreferrer"
            target="_blank"
            className="duration-100 hover:text-lime-500 text-base"
          >
            <h3 className="font-bold py-2">{cut(data.title, 58)}</h3>
          </Link>
          <p className="text-xs opacity-80 whitespace-pre-wrap">
            {cut(data.description, 100)}
          </p>
        </div>
        <div className="absolute bottom-2">
          {" "}
          <span className="font-bold">
            {data.pv}{" "}
            <span className="font-normal text-sm text-gray-500">pv</span>
          </span>
        </div>
      </div>
      {data.thumbnail && (
        <img
          src={data.thumbnail}
          className="h-32 border rounded aspect-square object-cover"
        />
      )}
    </div>
  );
}
