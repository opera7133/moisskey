import { nodes } from "@/lib/lexical/nodes";
import { $generateHtmlFromNodes } from "@lexical/html";
import { createEditor } from "lexical";
import { useEffect, useState } from "react";

export default function Text({ data }: { data: any }) {
  const [text, setText] = useState<string>("");
  const editor = createEditor({
    editable: false,
    nodes: nodes,
  });
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

  return (
    <div className="px-2 my-6">
      <div
        className="prose prose-sm max-w-none w-full"
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
    </div>
  );
}
