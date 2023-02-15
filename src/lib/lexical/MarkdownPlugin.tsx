import { FC } from "react";
import { TEXT_FORMAT_TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

export const MarkdownPlugin: FC = () => {
  return <MarkdownShortcutPlugin transformers={TEXT_FORMAT_TRANSFORMERS} />;
};
