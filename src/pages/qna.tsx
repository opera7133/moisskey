import Layout from "@/components/Layout";
import Image from "next/image";
import NextHeadSeo from "next-head-seo";

export default function QnA() {
  return (
    <Layout tab={false}>
      <NextHeadSeo title="Q&A - Moisskey" />
      <h2 className="my-8 text-4xl font-bold">Q&A</h2>
      <h3 className="my-4 text-2xl font-bold">
        まとめ内の自分のノートを削除したい
      </h3>
      <p>まとめ右上のメニューから「ノートを削除する」を選択してください。</p>
      <h3 className="my-4 text-2xl font-bold">まとめられたくない</h3>
      <Image
        src="/img/qna/visibility.png"
        alt="公開範囲の変更"
        width={289}
        height={322}
        className="rounded-lg mb-4"
      />
      <p>
        ノートの公開範囲を「フォロワー」または「ダイレクト」に設定するか、
        「ローカルのみ」に設定してください。
      </p>
      <h3 className="my-4 text-2xl font-bold">
        規約に違反しているまとめを見つけた
      </h3>
      <p>
        まとめ右上のメニューから「報告する」を選択し、該当の項目を選択してお送りください。
      </p>
      <h3 className="my-4 text-2xl font-bold">運営 / 開発は誰？</h3>
      <p className="mb-16">
        Moisskeyの運営・開発は<b>wamo</b>が行っています。
        <br />
        運営・開発に関する質問については
        <a
          href="https://misskey.io/@wamo"
          className="duration-100 text-blue-500 hover:text-blue-700 hover:underline"
        >
          @wamo@misskey.io
        </a>
        までどうぞ。
      </p>
    </Layout>
  );
}
