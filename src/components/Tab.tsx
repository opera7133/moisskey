import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Tab({
  type,
  user,
}: {
  type?: "index" | "user" | "none";
  user?: User;
}) {
  const router = useRouter();
  return (
    <>
      {type === "user" && (
        <div className="border-b border-gray-200">
          <ul className="flex flex-row items-center list-none py-2">
            <li>
              <Link
                href={`/id/${user?.username}`}
                className={`tab ${
                  router.pathname === `/id/[id]` && "border-lime-500"
                }`}
              >
                まとめ
              </Link>
            </li>
            <li>
              <Link
                href={`/id/${user?.username}/favorites`}
                className={`tab ${
                  router.pathname === "/id/[id]/favorites" && "border-lime-500"
                }`}
              >
                お気に入り
              </Link>
            </li>
            <li>
              <Link
                href={`/id/${user?.username}/comments`}
                className={`tab ${
                  router.pathname === "/id/[id]/comments" && "border-lime-500"
                }`}
              >
                コメント
              </Link>
            </li>
          </ul>
        </div>
      )}
      {type === "index" && (
        <div className="border-b border-gray-200">
          <ul className="container flex flex-row items-center list-none py-2">
            <li>
              <Link
                href="/"
                className={`tab ${
                  router.pathname === "/" && "border-lime-500"
                }`}
              >
                トップ
              </Link>
            </li>
            <li>
              <Link
                href="/recentpopular"
                className={`tab ${
                  router.pathname === "/recentpopular" && "border-lime-500"
                }`}
              >
                今週の人気
              </Link>
            </li>
            <li>
              <Link
                href="/recent"
                className={`tab ${
                  router.pathname === "/recent" && "border-lime-500"
                }`}
              >
                新着
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
