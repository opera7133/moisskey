import { ComponentProps, FC, forwardRef, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ToolbarPlugin } from "@/lib/lexical/ToolbarPlugin";
import { nodes } from "@/lib/lexical/nodes";
import { InlineToolbarPlugin } from "@/lib/lexical/InlineToolbarPlugin";
import { MarkdownPlugin } from "@/lib/lexical/MarkdownPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useAtom } from "jotai";
import { editorAtom } from "@/lib/atoms";

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "MoisskeyEditor",
  onError: (error) => console.error(error),
  nodes: nodes,
  theme: {
    text: {
      underline: "underline",
      strikethrough: "line-through",
      underlineStrikethrough: "underline line-through",
    },
  },
};

// eslint-disable-next-line react/display-name
const EditorCapturePlugin = forwardRef((props: any, ref: any) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    ref.current = editor;
    return () => {
      ref.current = null;
    };
  }, [editor, ref]);
  const [edata, setEData] = useAtom(editorAtom);
  useEffect(() => {
    editor.update(() => {
      if (edata) {
        const editorState = editor.parseEditorState(JSON.parse(edata.data));
        editor.setEditorState(editorState);
      }
    });
  });
  return null;
});

// eslint-disable-next-line react/display-name
export const Editor = forwardRef((props: any, ref: any) => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="lg:flex lg:flex-row lg:items-center lg:justify-between">
        <InlineToolbarPlugin />
        <ToolbarPlugin />
      </div>
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <ContentEditable className="bg-gray-100 p-4 h-[28vh] lg:h-[30vh] focus:outline-none prose prose-sm max-w-none" />
        }
        placeholder={<></>}
      />
      <EditorCapturePlugin ref={ref} />
      <MarkdownPlugin />
      <ListPlugin />
      <HistoryPlugin />
    </LexicalComposer>
  );
});
