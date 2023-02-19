import Head from "next/head";
import { Noto_Sans_JP } from "@next/font/google";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/atoms";
import Banner from "@/components/Banner";
import Header from "./Header";
import { ReactNode, useEffect } from "react";
import { useUserInfo } from "@/hooks/get";
import { Toaster } from "react-hot-toast";

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export default function Layout({
  children,
}: {
  tab?: boolean;
  children: ReactNode;
}) {
  const [auser, setAUser] = useAtom(userAtom);
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
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="document">
        <Header />
        <Toaster position="bottom-right" />
        <main className="px-4 py-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </>
  );
}
