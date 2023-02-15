import Link from "next/link";

export default function Footer() {
  return (
    <>
      <hr className="pb-3" />
      <footer className="container text-sm py-4">
        <h4 className="font-bold mb-2">Moisskeyについて</h4>
        <div className="flex flex-col md:flex-row gap-3 mb-2">
          <Link href="/tos">利用規約</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
          <Link href="/guideline">ガイドライン</Link>
          <Link href="/qna">Q&A</Link>
        </div>
        <p>CopyRight &copy; 2023 Moisskey. All Rights Reserved.</p>
      </footer>
    </>
  );
}
