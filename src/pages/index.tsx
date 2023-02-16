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
          type: "website",
          siteName: "Moisskey",
        }}
        twitter={{
          card: "summary",
        }}
      />
      <p>test</p>
    </Layout>
  );
}
