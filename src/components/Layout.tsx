import Head from "next/head";
import { Noto_Sans_JP } from "@next/font/google";
import NextHeadSeo from "next-head-seo";
import Banner from "@/components/Banner";
import Header from "@/components/Header";
import Tab from "@/components/Tab";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import { useUserInfo } from "@/hooks/get";
import { useRouter } from "next/router";

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export default function Layout({
  tab = true,
  children,
}: {
  tab?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useUserInfo();
  return (
    <>
      <style jsx global>
        {`
          :root {
            --notojp-font: ${notoSansJP.style.fontFamily};
          }
        `}
      </style>
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
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="document">
        <Header user={user} loading={loading} />
        <Banner type="warn" content="Moisskeyはアルファ版です！" />
        <Tab
          type={
            ["/", "/recent", "/hot"].includes(router.pathname.toString()) && tab
              ? "index"
              : "none"
          }
        />
        <main className="container grid grid-cols-3 gap-3">
          <div className="col-span-3 md:col-span-2">{children}</div>
          <div className="col-span-3 md:col-span-1"></div>
        </main>
        <Footer />
      </div>
    </>
  );
}
