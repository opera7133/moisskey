import NextHeadSeo from "next-head-seo";
import { Prisma } from "@prisma/client";
import Layout from "@/components/Layout";
import type { GetServerSidePropsContext } from "next";
import Topic from "@/components/Topic";
import Tab from "@/components/Tab";
import { prisma } from "@/lib/prisma";
import { setup } from "@/lib/csrf";

type UserWithComments = Prisma.UserGetPayload<{
  include: {
    comments: {
      include: {
        summary: {
          include: {
            user: true;
          };
        };
      };
    };
  };
}>;

type SummaryWithUser = Prisma.SummaryGetPayload<{
  include: {
    user: true;
  };
}>;

export default function Favorites({ user }: { user: UserWithComments }) {
  const links = user.addata as { name: string; value: string }[];
  let commentedSummary = [];
  if (user.comments) {
    commentedSummary = user.comments.map((comment: any) => comment.summary);
  }
  return (
    <Layout>
      <NextHeadSeo
        title={`${user.name}(@${user.username})のコメント(${user.comments.length}) - Moisskey`}
        description={`${user.name}(@${user.username})さんがコメントした${user.comments.length}件のまとめを一覧にしています。`}
        og={{
          title: `${user.name}(@${user.username})のコメント(${user.comments.length})`,
          description: `${user.name}(@${user.username})さんがコメントした${user.comments.length}件のまとめを一覧にしています。`,
          type: "article",
          siteName: "Moisskey",
        }}
        robots="noindex, nofollow"
      />
      <div className="py-2">
        <img src={user.banner || ""} alt="User Banner" />
        <div className="flex flex-row gap-4 items-start py-8">
          <img
            src={user.avatar || ""}
            alt="User Avatar"
            className="rounded-full w-20"
          />
          <div className="relative w-full">
            <h2 className="font-bold text-lg">{user.name}</h2>
            <span className="text-sm text-gray-500">{`@${user.username}`}</span>
            <p className="text-sm my-1">{user.description}</p>
            <table className="text-sm">
              <tbody>
                {links.map((site: { name: string; value: string }) => (
                  <tr key={site.name}>
                    <td className="pr-4">{site.name}</td>
                    <td>
                      <a
                        className="text-blue-500 duration-100 hover:text-blue-600 hover:underline"
                        rel="noopener noreferrer"
                        target="_blank"
                        href={site.value}
                      >
                        {site.value}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <a
              rel="noopener noreferrer"
              target="_blank"
              className="absolute top-0 right-2 w-5 h-5 fill-gray-300 duration-100 hover:fill-lime-500"
              href={`https://${user.origin}/@${user.username.replace(
                "@" + user.origin,
                ""
              )}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 146.24 102.49"
              >
                <path d="m17.84,0c-2.08,0-4.14.35-6.1,1.07-3.46,1.22-6.31,3.41-8.54,6.56C1.07,10.68,0,14.08,0,17.84v66.8c0,4.88,1.73,9.1,5.19,12.66,3.56,3.46,7.78,5.19,12.66,5.19s9.2-1.73,12.66-5.18c3.56-3.56,5.34-7.78,5.34-12.66v-12.15c.04-2.63,2.75-1.94,4.12,0,2.56,4.44,8,8.26,14.34,8.23h0c6.33-.02,11.59-3.15,14.34-8.23,1.04-1.22,3.97-3.31,4.27,0v12.15c0,4.88,1.73,9.1,5.18,12.66,3.56,3.46,7.78,5.19,12.66,5.19s9.2-1.73,12.66-5.18c3.56-3.56,5.34-7.78,5.34-12.66V17.84c0-3.76-1.12-7.16-3.35-10.21-2.14-3.16-4.94-5.34-8.39-6.56C94.97.35,92.94,0,90.9,0,85.41,0,80.78,2.14,77.02,6.41l-18.11,21.19c-.4.31-1.75,2.64-4.62,2.64s-4.05-2.33-4.46-2.63L31.57,6.41C27.91,2.14,23.34,0,17.84,0Zm112.84,0c-4.27,0-7.93,1.53-10.98,4.57-2.95,2.95-4.42,6.56-4.42,10.83s1.47,7.93,4.42,10.98c3.05,2.95,6.71,4.42,10.98,4.42s7.93-1.47,10.98-4.42c3.05-3.05,4.57-6.71,4.57-10.98s-1.52-7.88-4.57-10.83C138.62,1.53,134.96,0,130.69,0Zm.15,33.86c-4.27,0-7.93,1.53-10.98,4.57-3.05,3.05-4.57,6.71-4.57,10.98v37.67c0,4.27,1.52,7.93,4.57,10.98,3.05,2.95,6.71,4.42,10.98,4.42s7.88-1.47,10.83-4.42c3.05-3.05,4.57-6.71,4.57-10.98v-37.67c0-4.27-1.52-7.93-4.57-10.98-2.95-3.05-6.56-4.57-10.83-4.57Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div>
        <Tab type="user" user={user} />
        {commentedSummary.length !== 0 ? (
          commentedSummary.map((summary: SummaryWithUser) => (
            <Topic
              id={summary.id.toString()}
              avatar={summary.user.avatar || ""}
              key={summary.id.toString()}
              title={summary.title}
              published={summary.createdAt}
              pv={9}
            />
          ))
        ) : (
          <div className="py-2.5 px-4 bg-lime-200 rounded my-8 text-sm text-lime-600">
            <p>該当するまとめがありません。</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps = setup(
  async (ctx: GetServerSidePropsContext) => {
    const user = await prisma.user.findUnique({
      where: {
        username: ctx.query.id?.toString() || "",
      },
      include: {
        comments: {
          include: {
            summary: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    const data = JSON.parse(JSON.stringify(user));

    if (!user) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        user: data,
      },
    };
  }
);
