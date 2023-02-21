import Head from "next/head";
import { Noto_Sans_JP } from "@next/font/google";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/atoms";
import Banner from "@/components/Banner";
import Header from "@/components/Header";
import Tab from "@/components/Tab";
import Footer from "@/components/Footer";
import { ReactNode, useEffect } from "react";
import { useUserInfo } from "@/hooks/get";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

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
  const [auser, setAUser] = useAtom(userAtom);
  const router = useRouter();
  const { user, loading } = useUserInfo();
  useEffect(() => {
    if (user) {
      setAUser(user);
    }
  }, [user, loading, setAUser]);
  return (
    <>
      <style jsx global>
        {`
          :root {
            --notojp-font: ${notoSansJP.style.fontFamily};
          }
        `}
      </style>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="document">
        <Header />
        <Banner type="warn" content="Moisskeyはアルファ版です！" />
        <Tab
          type={
            [
              "/",
              "/recent",
              "/recentpopular",
              "/hot",
              "/li/[id]",
              "/t/[tag]",
              "/id/[id]",
            ].includes(router.pathname.toString()) && tab
              ? "index"
              : "none"
          }
        />
        <Toaster position="bottom-right" />
        <main className="container grid grid-cols-3 gap-3">
          <div className="col-span-3 md:col-span-2">{children}</div>
          <div className="col-span-3 md:col-span-1"></div>
        </main>
        <Footer />
      </div>
    </>
  );
}
