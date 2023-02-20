export default function Footer() {
  return (
    <>
      <hr className="pb-3" />
      <footer className="container text-sm py-4">
        <h4 className="font-bold mb-2">Moisskeyについて</h4>
        <div className="flex flex-col md:flex-row gap-3 mb-2">
          <a href={`${process.env.NEXT_PUBLIC_DOCS_URL}/tos`}>利用規約</a>
          <a href={`${process.env.NEXT_PUBLIC_DOCS_URL}/privacy`}>
            プライバシーポリシー
          </a>
          <a href={`${process.env.NEXT_PUBLIC_DOCS_URL}/user/guideline`}>
            ガイドライン
          </a>
          <a href={`${process.env.NEXT_PUBLIC_DOCS_URL}/user/qna`}>Q&A</a>
        </div>
        <p>CopyRight &copy; 2023 Moisskey. All Rights Reserved.</p>
      </footer>
    </>
  );
}
