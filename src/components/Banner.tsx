import { ReactNode } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { IoMdWarning } from "react-icons/io";

export default function Banner({
  type,
  content,
}: {
  type: "info" | "warn";
  content: ReactNode;
}) {
  return (
    <div className={type === "info" ? "bg-cyan-100" : "bg-amber-100"}>
      <div
        className={`container py-2 flex text-sm items-center gap-1 ${
          type === "info" ? "text-cyan-600" : "text-amber-600"
        }`}
      >
        {type === "info" ? (
          <BiInfoCircle size={20} className="fill-cyan-600" />
        ) : (
          <IoMdWarning size={20} className="fill-amber-600" />
        )}
        {content}
      </div>
    </div>
  );
}
