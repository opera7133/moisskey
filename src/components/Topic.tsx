import Link from "next/link";
import Image from "next/image";

export default function Topic({
  id,
  img,
  title,
  pv,
  published,
}: {
  id: string;
  img?: string;
  title: string;
  pv: number;
  published: Date;
}) {
  return (
    <div>
      <Link href={`/li/${id}`} className="group">
        <h3 className="group-hover:text-lime-500 duration-100">{title}</h3>
        <div className="mt-1 flex flex-row gap-2 items-center">
          <div>
            <Image
              src="/img/avatar.png"
              alt="avatar"
              width={26}
              height={26}
              className="rounded"
            />
          </div>
          <span className="font-bold">
            {pv} <span className="font-normal text-sm text-gray-500">pv</span>
          </span>
          <div className="bg-amber-400 text-white rounded-full text-xs px-1.5 py-0.5">
            New
          </div>
        </div>
      </Link>
      <hr className="my-3" />
    </div>
  );
}
