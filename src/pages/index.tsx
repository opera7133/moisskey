import Layout from "@/components/Layout";
import NextHeadSeo from "next-head-seo";

export default function Home() {
  return (
    <Layout>
      <NextHeadSeo
        title="Moisskey - Misskeyまとめ"
        description="今何がMisskeyで流行っているのか見てみよう。"
        og={{
          title: "Moisskey - Misskeyまとめ",
          description: "今何がMisskeyで流行っているのか見てみよう。",
          image: "/img/ogp.png",
          type: "website",
          siteName: "Moisskey",
        }}
        twitter={{
          card: "summary",
        }}
      />
      <div className="my-12">
        <h2 className="text-3xl font-bold">Moisskeyへようこそ！</h2>
      </div>
    </Layout>
  );
}
