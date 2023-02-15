import { ReactNode } from "react";

export default function Droppable({
  type,
  children,
  title,
  className = "",
}: {
  type: "notes" | "select";
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  if (!children || children.toString() === "false,false")
    return (
      <div className={`h-[83vh] overflow-y-scroll border ${className}`}>
        {type === "notes" ? (
          <div className="w-80 mx-auto mt-12 bg-gray-100 py-4 text-sm">
            <p className="text-center mb-3">ノートの選び方</p>
            <ul className="list-disc pl-8 pr-3">
              <li className="mb-2">
                下のボタンをクリック＆検索して必要なノートを取得しましょう。
              </li>
              <li className="mb-2">
                キーワードだけでなく、ユーザ名を指定してノートを取得することも可能です。
              </li>
              <li className="mb-2">
                ノートのURLを指定して読み込むと、検索できないノートも取得できます。
              </li>
              <li className="mb-2">
                フォロワーのみ・ローカルのみの投稿は取得できません。
              </li>
            </ul>
          </div>
        ) : (
          <div className="w-80 mx-auto mt-12 bg-gray-100 py-4 text-sm">
            <p className="text-center mb-3">まとめ方</p>
            <ul className="list-disc pl-8 pr-3">
              <li className="mb-2">
                このカラムにまとめたいノートやテキストなどのアイテムを移動させて並び替えましょう。
              </li>
              <li className="mb-2">
                完成したら「まとめを投稿する」を押して投稿しましょう。
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  return (
    <div className={`h-[83vh] overflow-y-scroll border ${className}`}>
      {children && title && (
        <div className="py-2.5 px-4 text-white bg-lime-600 text-sm">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
