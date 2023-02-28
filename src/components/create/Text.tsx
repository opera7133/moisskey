import { nodes } from "@/lib/lexical/nodes";
import { $generateHtmlFromNodes } from "@lexical/html";
import { createEditor } from "lexical";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaEdit, FaTimes } from "react-icons/fa";
import { useAtom } from "jotai";
import { activesAtom, editorAtom } from "@/lib/atoms";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useSortable } from "@dnd-kit/sortable";
import { twMerge } from "tailwind-merge";

export default function Text({ mkey, data }: { mkey: string; data: any }) {
  const [width, height] = useWindowSize();
  const [actives, setActives] = useAtom(activesAtom);
  const [edata, setEData] = useAtom(editorAtom);
  const [text, setText] = useState<string>("");
  const editor = createEditor({
    editable: false,
    nodes: nodes,
  });
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: mkey,
      data: data,
      disabled: width < 1024,
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);
        setText(htmlString);
      });
    });
    editor.update(() => {
      const editorState = editor.parseEditorState(JSON.parse(data.data));
      editor.setEditorState(editorState);
    });
  });

  function moveUp(nid: string) {
    const target = actives.findIndex((at) => at.id === nid);
    const targetElm = actives[target];
    const replaceElm = target === 0 ? actives[target] : actives[target - 1];
    setActives(
      actives.map((nt, i) => {
        if (i === target) return replaceElm;
        if (i === target - 1) return targetElm;
        return nt;
      })
    );
  }
  function moveDown(nid: string) {
    const target = actives.findIndex((at) => at.id === nid);
    const targetElm = actives[target];
    const replaceElm =
      target === actives.length - 1 ? actives[target] : actives[target + 1];
    setActives(
      actives.map((nt, i) => {
        if (i === target) return replaceElm;
        if (i === target + 1) return targetElm;
        return nt;
      })
    );
  }
  function deleteFrom(nid: string) {
    setActives(
      actives.filter((at) => {
        if (at.type === "text") return at.id !== nid;
        return true;
      })
    );
  }

  return (
    <div
      className={twMerge("bg-white z-50", isDragging && "invisible")}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="flex pt-2 px-2 relative">
        <div
          className="prose prose-sm max-w-none w-full"
          key={mkey}
          dangerouslySetInnerHTML={{ __html: text }}
        ></div>
        <button
          className="hidden lg:block absolute top-1 right-1 group"
          onClick={() => deleteFrom(data.id)}
        >
          <FaTimes
            size={20}
            className="fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
          />
        </button>
        <div className="flex flex-col gap-1 items-center px-1 pt-2 lg:hidden">
          <button className="group" onClick={() => setEData(data)}>
            <FaEdit
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
          <button className="group" onClick={() => deleteFrom(data.id)}>
            <FaTimes
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
          <button className="group" onClick={() => moveUp(data.id)}>
            <FaArrowUp
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
          <button className="group" onClick={() => moveDown(data.id)}>
            <FaArrowDown
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
        </div>
      </div>
      <hr className="border-dotted mt-4" />
    </div>
  );
}
