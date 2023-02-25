import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function Paginator({
  length,
  page,
  type,
}: {
  length: number;
  page: number;
  type: string;
}) {
  return (
    <>
      <div className="flex gap-1 items-center justify-center text-gray-600 font-bold">
        {(() => {
          const pages = [];
          if (page !== 1) {
            pages.push(
              <Link
                className="border border-gray-200 px-2 rounded-md py-1 duration-100 hover:bg-gray-100"
                href={`/${type}?page=${page - 1}`}
              >
                前へ
              </Link>
            );
          }
          for (let i = 1; i < Math.ceil(length / 25) + 1; i++) {
            if (i > 1) {
              pages.push(
                <Link
                  className={twMerge(
                    "border border-gray-200 px-2 rounded-md py-1 duration-100 hover:bg-gray-100",
                    page === i && "bg-gray-100"
                  )}
                  href={`/${type}?page=${i}`}
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
                  href={`/${type}`}
                >
                  {i}
                </Link>
              );
            }
          }
          if (page !== Math.ceil(length / 25)) {
            pages.push(
              <Link
                className="border border-gray-200 px-2 rounded-md py-1 duration-100 hover:bg-gray-100"
                href={`/${type}?page=${page + 1}`}
              >
                次へ
              </Link>
            );
          }
          return pages;
        })()}
      </div>
    </>
  );
}
