import Layout from "@/components/Layout";
import NextHeadSeo from "next-head-seo";
import Link from "next/link";

export default function NotFound() {
  return (
    <Layout>
      <NextHeadSeo
        title="404 Not Found - Moisskey"
        robots="noindex, nofollow"
        og={{
          title: "404 Not Found",
          image: `${process.env.NEXT_PUBLIC_SITE_URL}/img/ogp.png`,
          type: "article",
          siteName: "Moisskey",
        }}
        twitter={{
          card: "summary",
        }}
      />
      <div className="my-12">
        <div className="py-2.5 px-4 bg-lime-200 rounded my-8 text-sm text-lime-600">
          <p>お探しのページが見つかりませんでした。</p>
          <Link href="/" className="hover:underline">
            トップページに戻る
          </Link>
        </div>
      </div>
    </Layout>
  );
}
