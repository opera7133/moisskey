import { DeleteType } from "@/types/note";

export default function MDelete({ data }: { data: DeleteType }) {
  return (
    <div className="text-sm px-2 w-full text-center text-gray-500 py-2">
      <p>このノートは権利者により削除されました</p>
    </div>
  );
}
