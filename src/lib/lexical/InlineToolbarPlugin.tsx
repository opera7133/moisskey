import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import ColorPicker from "./ColorPicker";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FC, useCallback, useEffect, useState } from "react";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdStrikethroughS,
} from "react-icons/md";

export const InlineToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [fontColor, setFontColor] = useState<string>("#000");
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) return;
        setIsBold(selection.hasFormat("bold"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsStrikethrough(selection.hasFormat("strikethrough"));
        setIsItalic(selection.hasFormat("italic"));
        setFontColor(
          $getSelectionStyleValueForProperty(selection, "color", "#000")
        );
      });
    });
  }, [editor]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [editor]
  );

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value });
    },
    [applyStyleText]
  );

  return (
    <div>
      <button
        type="button"
        aria-label="format bold"
        className="duration-100 hover:bg-gray-100 p-2 aria-checked:bg-gray-100"
        role="checkbox"
        aria-checked={isBold}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <MdFormatBold size={25} />
      </button>
      <button
        type="button"
        aria-label="format underline"
        className="duration-100 hover:bg-gray-100 p-2 aria-checked:bg-gray-100"
        role="checkbox"
        aria-checked={isUnderline}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <MdFormatUnderlined size={25} />
      </button>
      <button
        type="button"
        aria-label="format strikethrough"
        className="duration-100 hover:bg-gray-100 p-2 aria-checked:bg-gray-100"
        role="checkbox"
        aria-checked={isStrikethrough}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
      >
        <MdStrikethroughS size={25} />
      </button>
      <button
        type="button"
        aria-label="format italic"
        className="duration-100 hover:bg-gray-100 p-2 aria-checked:bg-gray-100"
        role="checkbox"
        aria-checked={isItalic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <MdFormatItalic size={25} />
      </button>
      <ColorPicker
        buttonClassName="duration-100 hover:bg-gray-100 p-2 aria-checked:bg-gray-100"
        buttonAriaLabel="format text color"
        color={fontColor}
        onChange={onFontColorSelect}
        title="text color"
      />
    </div>
  );
};
