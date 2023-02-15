import {
  $isRangeSelection,
  $getSelection,
  $createParagraphNode,
} from "lexical";
import {
  HeadingTagType,
  $createQuoteNode,
  $createHeadingNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $getNearestNodeOfType } from "@lexical/utils";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import { $wrapNodes } from "@lexical/selection";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FC, useCallback, useEffect, useState } from "react";
import { BiParagraph } from "react-icons/bi";
import { TbH1, TbH2, TbH3 } from "react-icons/tb";
import {
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
} from "react-icons/md";

const SupportedBlockType = {
  paragraph: "テキスト",
  h1: "見出し1",
  h2: "見出し2",
  h3: "見出し3",
  h4: "見出し4",
  h5: "見出し5",
  h6: "見出し6",
  quote: "引用",
  number: "番号付きリスト",
  bullet: "黒丸付きリスト",
  check: "チェックリスト",
} as const;

type BlockType = keyof typeof SupportedBlockType;

export const ToolbarPlugin: FC = () => {
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [editor] = useLexicalComposerContext();

  const formatHeading = useCallback(
    (type: HeadingTagType | "paragraph") => {
      if (blockType !== type && type !== "paragraph") {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createHeadingNode(type));
          }
        });
      } else if (type === "paragraph") {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createParagraphNode());
          }
        });
      }
    },
    [blockType, editor]
  );

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchorNode = selection.anchor.getNode();
        const targetNode =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();

        if ($isHeadingNode(targetNode)) {
          const tag = targetNode.getTag();
          setBlockType(tag);
        } else if ($isListNode(targetNode)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const listType = parentList
            ? parentList.getListType()
            : targetNode.getListType();

          setBlockType(listType);
        } else {
          const nodeType = targetNode.getType();
          if (nodeType in SupportedBlockType) {
            setBlockType(nodeType as BlockType);
          } else {
            setBlockType("paragraph");
          }
        }
      });
    });
  }, [editor]);

  const formatQuote = useCallback(() => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  }, [blockType, editor]);

  const formatBulletList = useCallback(() => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  }, [blockType, editor]);

  const formatNumberedList = useCallback(() => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  }, [blockType, editor]);

  return (
    <div className="">
      <button
        type="button"
        role="checkbox"
        className="duration-100 hover:bg-gray-100 p-2 aria-checked:bg-gray-100"
        title={SupportedBlockType["paragraph"]}
        aria-label={SupportedBlockType["paragraph"]}
        aria-checked={blockType === "paragraph"}
        onClick={() => formatHeading("paragraph")}
      >
        <BiParagraph size={25} />
      </button>
      <button
        type="button"
        role="checkbox"
        className="duration-100 hover:bg-gray-100 p-2 aria-checked:bg-gray-100"
        title={SupportedBlockType["h1"]}
        aria-label={SupportedBlockType["h1"]}
        aria-checked={blockType === "h1"}
        onClick={() => formatHeading("h1")}
      >
        <TbH1 size={25} />
      </button>
      <button
        type="button"
        role="checkbox"
        className="duration-100 hover:bg-gray-100 p-2 aria-checked:bg-gray-100"
        title={SupportedBlockType["h2"]}
        aria-label={SupportedBlockType["h2"]}
        aria-checked={blockType === "h2"}
        onClick={() => formatHeading("h2")}
      >
        <TbH2 size={25} />
      </button>
      <button
        type="button"
        role="checkbox"
        className="duration-100 hover:bg-gray-100 p-2 aria-checked:bg-gray-100"
        title={SupportedBlockType["h3"]}
        aria-label={SupportedBlockType["h3"]}
        aria-checked={blockType === "h3"}
        onClick={() => formatHeading("h3")}
      >
        <TbH3 size={25} />
      </button>
      <button
        type="button"
        role="checkbox"
        className="duration-100 hover:bg-gray-100 p-2 aria-checked:bg-gray-100"
        title={SupportedBlockType["quote"]}
        aria-label={SupportedBlockType["quote"]}
        aria-checked={blockType === "quote"}
        onClick={formatQuote}
      >
        <MdFormatQuote size={25} />
      </button>
      <button
        type="button"
        role="checkbox"
        className="duration-100 hover:bg-gray-100 p-2 aria-checked:bg-gray-100"
        title={SupportedBlockType["bullet"]}
        aria-label={SupportedBlockType["bullet"]}
        aria-checked={blockType === "bullet"}
        onClick={formatBulletList}
      >
        <MdFormatListBulleted size={25} />
      </button>
      <button
        type="button"
        role="checkbox"
        className="duration-100 hover:bg-gray-100 p-2 aria-checked:bg-gray-100"
        title={SupportedBlockType["number"]}
        aria-label={SupportedBlockType["number"]}
        aria-checked={blockType === "number"}
        onClick={formatNumberedList}
      >
        <MdFormatListNumbered size={25} />
      </button>
    </div>
  );
};
