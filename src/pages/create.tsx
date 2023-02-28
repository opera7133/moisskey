import Note from "@/components/create/Note";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import NextHeadSeo from "next-head-seo";
import Button from "@/components/create/Button";
import { BiSearchAlt2, BiLinkAlt, BiImageAlt, BiVideo } from "react-icons/bi";
import Droppable from "@/components/create/Droppable";
import { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Editor } from "@/components/create/Editor";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import {
  notesAtom,
  activesAtom,
  editorAtom,
  urlsDialogAtom,
} from "@/lib/atoms";
import { v4 } from "uuid";
import Embed from "@/components/create/Embed";
import Text from "@/components/create/Text";
import MImage from "@/components/create/Image";
import ImageDialog from "@/components/create/ImageDialog";
import { getUnixTime } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import { GetServerSidePropsContext } from "next";
import { Tags, User } from "@prisma/client";
import { setup } from "@/lib/csrf";
import { getCookie } from "cookies-next";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import UrlsDialog from "@/components/create/UrlsDialog";
import Video from "@/components/create/Video";
import Internal from "@/components/create/Internal";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { DataType } from "@/types/note";
import { arrayMove } from "@dnd-kit/sortable";

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export default function Create({
  summaryId,
  user,
}: {
  summaryId: string;
  user: User;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [url, setURL] = useState({
    embed: "",
    image: "",
    video: "",
    internal: "",
  });
  const [thumbnail, setThumbnail] = useState([]);
  const [summary, setSummary] = useState<{
    summaryId: string;
    userId: string;
    title: string;
    description: string;
    thumbnail: string;
    draft: boolean;
    hidden: "PUBLIC" | "UNLISTED" | "PRIVATE";
    tags: Array<string>;
  }>({
    summaryId: "",
    userId: "",
    title: "",
    description: "",
    thumbnail: "",
    draft: true,
    hidden: "PUBLIC",
    tags: [],
  });
  const [lastNote, setLastNote] = useState<
    ["home" | "self" | "reactions" | "favorites" | "search" | "urls", string]
  >(["home", ""]);
  const [notes, setNotes] = useAtom(notesAtom);
  const [dragging, setDragging] = useState<DataType>();
  const [actives, setActives] = useAtom(activesAtom);
  const [edata, setEData] = useAtom(editorAtom);
  const [urls, setUrls] = useAtom(urlsDialogAtom);
  const [inputOpen, setInputOpen] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const editorRef: any = useRef();

  async function getNotes(
    type: "home" | "self" | "reactions" | "favorites" | "search" | "urls",
    more?: boolean
  ) {
    if (!more) {
      if (type !== "search" && type !== "urls") {
        const data = await (await fetch(`/api/notes/${type}`)).json();
        if (data.status !== "error") {
          switch (type) {
            case "home":
              setTitle("あなたのタイムライン");
              break;
            case "self":
              setTitle("あなたのノート");
              break;
            case "favorites":
              setTitle("あなたのお気に入り");
              break;
            case "reactions":
              setTitle("あなたのリアクション");
              break;
          }
          setNotes(data.notes.map((note: any) => ({ ...note, type: "note" })));
          setLastNote([type, data.notes[data.notes.length - 1].createdAt]);
        } else {
          toast.error(data.error);
        }
      } else if (type === "search") {
        const data = await (
          await fetch(`/api/notes/search?query=${search}`)
        ).json();
        if (data.status !== "error") {
          setTitle(`「${search}」の検索結果`);
          setNotes(data.notes.map((note: any) => ({ ...note, type: "note" })));
          setLastNote(["search", data.notes[data.notes.length - 1].createdAt]);
        } else {
          toast.error(data.error);
        }
      } else {
        const data = await (
          await fetch(`/api/notes/urls`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              urls: urls[1],
            }),
          })
        ).json();
        if (data.status !== "error") {
          console.log(data.notes);
          setTitle("読み込んだノート");
          setNotes(data.notes.map((note: any) => ({ ...note, type: "note" })));
          setLastNote(["urls", data.notes[data.notes.length - 1].createdAt]);
        } else {
          toast.error(data.error);
        }
      }
    } else {
      if (type !== "search") {
        const untilDate = getUnixTime(new Date(lastNote[1])) * 1000;
        const data = await (
          await fetch(`/api/notes/${type}?untilDate=${untilDate}`)
        ).json();
        if (data.status !== "error") {
          switch (type) {
            case "home":
              setTitle("あなたのタイムライン");
              break;
            case "self":
              setTitle("あなたのノート");
              break;
            case "favorites":
              setTitle("あなたのお気に入り");
              break;
            case "reactions":
              setTitle("あなたのリアクション");
              break;
          }
          setNotes([
            ...notes,
            ...data.notes.map((note: any) => ({ ...note, type: "note" })),
          ]);
          setLastNote([type, data.notes[data.notes.length - 1].createdAt]);
        } else {
          toast.error(data.error);
        }
      } else if (type === "search") {
        const data = await (
          await fetch(`/api/notes/search?query=${search}`)
        ).json();
        setTitle(`「${search}」の検索結果`);
        if (data.status !== "error") {
          setNotes([
            ...notes,
            ...data.notes.map((note: any) => ({ ...note, type: "note" })),
          ]);
          setLastNote(["search", data.notes[data.notes.length - 1].createdAt]);
        } else {
          toast.error(data.error);
        }
      }
    }
  }

  async function addOther(type: "url" | "image" | "video" | "internal") {
    try {
      if (type === "url") {
        const data = await (
          await fetch("/api/utils/getUrlQuery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url.embed }),
          })
        ).json();
        if (data.status === "success") {
          setActives([
            ...actives,
            {
              id: v4(),
              type: "url",
              url: data.data.url,
              og: {
                title: data.data.title,
                siteName: data.data["og:site_name"],
                image: data.data["og:image"],
                description: data.data.description,
              },
            },
          ]);
          setURL({
            image: "",
            embed: "",
            video: "",
            internal: "",
          });
        } else {
          toast.error(data.error);
        }
      } else if (type === "image") {
        setActives([
          ...actives,
          {
            id: v4(),
            type: "image",
            url: url.image,
          },
        ]);
        setURL({
          image: "",
          embed: "",
          video: "",
          internal: "",
        });
      } else if (type === "video") {
        const data = await (
          await fetch("/api/utils/validateVideo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url.video }),
          })
        ).json();
        if (data.status === "success") {
          setActives([...actives, data.data]);
          setURL({
            image: "",
            embed: "",
            video: "",
            internal: "",
          });
        } else {
          toast.error(data.error);
        }
      } else {
        const id = (url.internal.match(
          /http(?:s?):\/\/(?:www\.)?moisskey\.com\/li\/([0-9]+)/
        ) || "")[1];
        const data = await (
          await fetch("/api/summary/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ summaryId: Number(id) }),
          })
        ).json();
        if (data.status === "success") {
          console.log(data);
          setActives([
            ...actives,
            {
              type: "internal",
              id: data.data.id.toString(),
              title: data.data.title,
              pv: data.data.pageviews,
              description: data.data.description,
              thumbnail: data.data.thumbnail,
              username: data.data.user.username,
              userAvatar: data.data.user.avatar,
              createdAt: new Date(data.data.createdAt),
            },
          ]);
          setURL({
            image: "",
            embed: "",
            video: "",
            internal: "",
          });
        } else {
          toast.error(data.error);
        }
      }
    } catch (e) {
      toast.error("取得中にエラーが発生しました");
    }
  }

  function removeDup() {
    setActives(
      actives.filter((element, index, self) => {
        if (element.type === "note") {
          return (
            self.findIndex((e) => {
              if (e.type === "note") return e.id === element.id;
            }) === index
          );
        } else {
          return true;
        }
      })
    );
  }

  function clear() {
    const check = confirm("内容を全て削除します。よろしいですか？");
    if (check) {
      setActives([]);
    }
  }

  function addText() {
    if (editorRef.current !== undefined) {
      if (editorRef.current !== null) {
        try {
          const latestEditorState = editorRef.current.getEditorState();
          const text = JSON.stringify(latestEditorState);
          if (edata) {
            setActives(
              actives.map((at) => {
                if (at.type === "text" && at.id === edata.id) {
                  return { ...at, data: text };
                }
                return at;
              })
            );
            setEData(null);
          } else {
            setActives([...actives, { id: v4(), type: "text", data: text }]);
          }
        } catch (e) {
          toast.error("追加時にエラーが発生しました");
        }
      }
    }
    setIsOpen(false);
  }

  async function publishSummary() {
    if (!summary.title) {
      toast.error("まとめのタイトルがありません");
      return;
    }
    const chk = confirm("この内容でまとめを投稿します。よろしいですか？");
    if (chk) {
      const tm = thumbnail.length !== 0 ? thumbnail[0] : null;
      const res = await (
        await fetch("/api/summary/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...summary,
            userId: user?.id,
            draft: false,
            data: actives,
            thumbnail: summary.thumbnail || tm,
          }),
        })
      ).json();
      if (res.status !== "success") {
        toast.error(res.error);
      } else {
        toast.success("まとめが投稿されました！");
        setEData(null);
        setActives([]);
        setNotes([]);
        setSummary({
          summaryId: "",
          userId: "",
          title: "",
          description: "",
          thumbnail: "",
          draft: true,
          hidden: "PUBLIC",
          tags: [],
        });
        router.push(`/li/${res.data.id}`);
      }
    }
  }

  async function saveDraft() {
    const chk = confirm(
      "この内容でまとめを下書きとして保存します。よろしいですか？"
    );
    if (chk) {
      const res = await (
        await fetch("/api/draft/saveDraft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...summary,
            draft: true,
            data: actives,
          }),
        })
      ).json();
      if (res.status !== "success") {
        toast.error(res.error);
      } else {
        toast.success("まとめを保存しました！");
        router.push("/");
      }
    }
  }

  async function editSummary() {
    if (summaryId) {
      const res = await (
        await fetch("/api/summary/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ summaryId: summaryId }),
        })
      ).json();
      if (res.status === "success" && res.data && res.data.data) {
        setActives(res.data.data);
        let tags = [];
        if (res.data.tags) {
          tags = res.data.tags.map((tag: any) => tag.tags.name.trim());
        }
        setSummary({
          summaryId: summaryId,
          userId: res.data.userId,
          title: res.data.title,
          description: res.data.description,
          thumbnail: res.data.thumbnail,
          draft: true,
          hidden: res.data.hidden,
          tags: tags,
        });
      }
    }
  }

  async function getDraft() {
    const res = await (
      await fetch("/api/draft/getDraft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      })
    ).json();
    if (res.status === "success" && res.data && res.data.data) {
      const chk = confirm("以前の下書きが保存されています。読み込みますか？");
      if (chk) {
        setActives(res.data.data);
        let tags = [];
        if (res.data.tags) {
          tags = res.data.tags.map((tag: Tags) => tag.name.trim());
        }
        setSummary({
          summaryId: "",
          userId: res.data.userId,
          title: res.data.title,
          description: res.data.description,
          thumbnail: res.data.thumbnail,
          draft: true,
          hidden: res.data.hidden,
          tags: tags,
        });
      }
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current) {
      //@ts-ignore
      setDragging(event.active.data.current);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      if (
        over?.data.current?.sortable.containerId === "notes" &&
        active.data.current?.sortable.containerId === "notes"
      ) {
        // ノートフィールのアイテムをノートフィールドのアイテムの上下へ
        console.log("same field, just sort");
        setNotes((notes) => {
          const oldIndex = notes.findIndex((note) => note.id === active.id);
          const newIndex = notes.findIndex((note) => note.id === over?.id);
          return arrayMove(notes, oldIndex, newIndex);
        });
      } else if (
        over?.data.current?.sortable.containerId === "select" &&
        active.data.current?.sortable.containerId === "select"
      ) {
        // セレクトフィールのアイテムをセレクトフィールドのアイテムの上下へ
        console.log("same field, just sort");
        setActives((actives) => {
          const oldIndex = actives.findIndex((at) => at.id === active.id);
          const newIndex = actives.findIndex((at) => at.id === over?.id);
          return arrayMove(actives, oldIndex, newIndex);
        });
      } else if (
        over?.id === "notes" &&
        active.data.current?.sortable.containerId === "select"
      ) {
        // セレクトフィールドのアイテムをノートフィールドへ
        console.log("different field, insert to notes");
        const item = actives.find((at) => at.id === active.id);
        if (item && item.type === "note") {
          setActives(
            actives.filter((at) => {
              if (at.type === "note") return at.id !== active.id;
              return true;
            })
          );
          setNotes([...notes, item]);
        }
      } else if (
        over?.id === "select" &&
        active.data.current?.sortable.containerId === "notes"
      ) {
        // ノートフィールドのアイテムをセレクトフィールドへ
        console.log("different field, insert to select");
        const note = notes.find((nt) => nt.id === active.id);
        if (note) {
          setNotes(notes.filter((nt) => nt.id !== note.id));
          setActives([...actives, note]);
        }
      } else if (
        over?.id === "notes" &&
        active.data.current?.sortable.containerId === "notes"
      ) {
        // ノートフィールドのアイテムをノートフィールドへ
        console.log("same field, insert to notes");
        setNotes((notes) => {
          const oldIndex = notes.findIndex((note) => note.id === active.id);
          return arrayMove(notes, oldIndex, notes.length - 1);
        });
      } else if (
        over?.id === "select" &&
        active.data.current?.sortable.containerId === "select"
      ) {
        // セレクトフィールドのアイテムをセレクトフィールドへ
        console.log("same field, insert to select");
        setActives((actives) => {
          const oldIndex = actives.findIndex((at) => at.id === active.id);
          return arrayMove(actives, oldIndex, actives.length - 1);
        });
      } else if (
        over?.data.current?.sortable.containerId === "select" &&
        active.data.current?.sortable.containerId === "notes"
      ) {
        const note = notes.find((nt) => nt.id === active.id);
        if (note) {
          setNotes(notes.filter((nt) => nt.id !== note.id));
          setActives((actives) => {
            const oldIndex = actives.length;
            const newIndex = actives.findIndex((at) => at.id === over?.id);
            return arrayMove([...actives, note], oldIndex, newIndex);
          });
        }
      } else if (
        over?.data.current?.sortable.containerId === "notes" &&
        active.data.current?.sortable.containerId === "select"
      ) {
        const item = actives.find((at) => at.id === active.id);
        if (item && item.type === "note") {
          setActives(
            actives.filter((at) => {
              if (at.type === "note") return at.id !== active.id;
              return true;
            })
          );
          setNotes((notes) => {
            const oldIndex = notes.length;
            const newIndex = notes.findIndex((at) => at.id === over?.id);
            return arrayMove([...notes, item], oldIndex, newIndex);
          });
        }
      }
    }
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor);

  useEffect(() => {
    if (!summaryId) {
      getDraft();
    } else {
      editSummary();
    }
  }, []);

  useEffect(() => {
    if (edata) {
      setIsOpen(true);
    }
  }, [edata]);

  useEffect(() => {
    let images = actives
      .map((at) => {
        if (at && at.type === "note") {
          if (at.files.length !== 0) {
            return at.files.map((file) => file.thumbnailUrl);
          } else if (at.renote?.files.length !== 0) {
            return at.renote?.files.map((file) => file.thumbnailUrl);
          }
        }
      })
      .filter(Boolean)
      .map((im) => im && im[0]);
    images = [].concat.apply([], images);
    if (images.length !== 0) {
      // @ts-ignore
      setThumbnail(images);
    }
  }, [actives]);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <style jsx global>
        {`
          :root {
            --notojp-font: ${notoSansJP.style.fontFamily};
          }
        `}
      </style>
      <NextHeadSeo
        title="Misskeyまとめの作成 - Moisskey"
        robots="noindex, nofollow"
        og={{
          title: "Misskeyまとめの作成",
          siteName: "Moisskey",
          type: "article",
        }}
      />
      <main className="mx-auto max-w-7xl overflow-x-scroll lg:overflow-auto flex lg:grid lg:grid-cols-3 h-screen max-h-screen">
        <div className="h-full min-w-full lg:min-w-0">
          <Droppable items={notes} type="notes" title={title}>
            {notes.length !== 0 &&
              notes.map((note) => {
                if (
                  note.localOnly ||
                  note.renote?.localOnly ||
                  ["followers", "specified"].includes(note.visibility) ||
                  ["followers", "specified"].includes(
                    note.renote?.visibility || ""
                  )
                )
                  return false;
                return (
                  <Note
                    id={note.id}
                    key={note.id}
                    mkey={note.id}
                    note={note}
                    active={false}
                  />
                );
              })}
            {notes.length !== 0 && lastNote[0] !== "urls" && (
              <button
                onClick={() => getNotes(lastNote[0], true)}
                className="mx-auto block rounded text-center bg-gray-200 duration-100 hover:bg-gray-300 py-1 w-80 my-2 text-sm"
              >
                さらに表示
              </button>
            )}
          </Droppable>
          <div className="border h-1/6 p-2">
            <div className="flex flex-wrap gap-2">
              <Button
                text="ホーム"
                onClick={async () => await getNotes("home")}
              />
              <Button
                text="自分"
                onClick={async () => await getNotes("self")}
              />
              <Button
                text="リアクション"
                onClick={async () => await getNotes("reactions")}
              />
              <Button
                text="お気に入り"
                onClick={async () => await getNotes("favorites")}
              />
              <Button
                text="URL"
                onClick={async () => await setUrls([true, []])}
              />
            </div>
            <div className="relative flex flex-row mt-2">
              <BiSearchAlt2
                size={20}
                color="gray"
                className="absolute left-2 top-2"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="キーワードを入力"
                className="py-1 pl-8 rounded-l"
              />
              <button
                onClick={async () => await getNotes("search")}
                className="bg-gray-200 px-3 duration-100 hover:bg-gray-300 rounded-r"
              >
                検索
              </button>
            </div>
          </div>
        </div>
        <div className="h-full min-w-full lg:min-w-0">
          <Droppable
            items={actives}
            type="select"
            className="h-5/6 overflow-y-scroll overflow-x-hidden border py-2"
          >
            {actives.length !== 0 &&
              actives
                .map((active) => {
                  if (!active || active.type === "delete") {
                    return null;
                  }
                  if (active.type === "note") {
                    return (
                      <Note
                        id={active.id}
                        mkey={active.id}
                        key={active.id}
                        note={active}
                        active={true}
                      />
                    );
                  }
                  if (active.type === "url") {
                    return (
                      <Embed mkey={active.id} key={active.id} data={active} />
                    );
                  }
                  if (active.type === "video") {
                    return (
                      <Video mkey={active.id} key={active.id} data={active} />
                    );
                  }
                  if (active.type === "text") {
                    return (
                      <Text mkey={active.id} key={active.id} data={active} />
                    );
                  }
                  if (active.type == "image") {
                    return (
                      <MImage mkey={active.id} key={active.id} data={active} />
                    );
                  }
                  if (active.type == "internal") {
                    return (
                      <Internal
                        mkey={active.id}
                        key={active.id}
                        data={active}
                      />
                    );
                  }
                })
                .filter(Boolean)}
          </Droppable>
          <div className="border h-1/6 p-2">
            <div className="flex flex-wrap gap-2">
              <Button
                text="URL"
                onClick={() =>
                  !inputOpen ? setInputOpen("site") : setInputOpen("")
                }
              />
              <Button
                text="テキスト"
                onClick={() => {
                  setEData(null);
                  setIsOpen(true);
                }}
              />
              <Button
                text="画像"
                onClick={() =>
                  !inputOpen ? setInputOpen("image") : setInputOpen("")
                }
              />
              <Button
                text="動画"
                onClick={() =>
                  !inputOpen ? setInputOpen("video") : setInputOpen("")
                }
              />
              <Button
                text="まとめ"
                onClick={() =>
                  !inputOpen ? setInputOpen("internal") : setInputOpen("")
                }
              />
              <Button text="重複分を削除" onClick={() => removeDup()}></Button>
              <Button text="クリア" onClick={() => clear()}></Button>
            </div>
            {inputOpen === "site" && (
              <div className="relative flex flex-row mt-2">
                <BiLinkAlt
                  size={20}
                  color="gray"
                  className="absolute left-2 top-2"
                />
                <input
                  id="site"
                  type="text"
                  placeholder="URLを入力"
                  value={url.embed}
                  onChange={(e) =>
                    setURL({
                      ...url,
                      embed: e.target.value,
                    })
                  }
                  className="py-1 pl-8 rounded-l"
                />
                <button
                  onClick={() => addOther("url")}
                  className="bg-gray-200 px-3 duration-100 hover:bg-gray-300 rounded-r"
                >
                  情報を取得
                </button>
              </div>
            )}
            {inputOpen === "image" && (
              <div className="relative flex flex-row mt-2">
                <BiImageAlt
                  size={20}
                  color="gray"
                  className="absolute left-2 top-2"
                />
                <input
                  id="image"
                  type="text"
                  placeholder="画像のURLを入力"
                  value={url.image}
                  onChange={(e) =>
                    setURL({
                      ...url,
                      image: e.target.value,
                    })
                  }
                  className="py-1 pl-8 rounded-l"
                />
                <button
                  onClick={() => addOther("image")}
                  className="bg-gray-200 px-3 duration-100 hover:bg-gray-300 rounded-r"
                >
                  画像を取得
                </button>
              </div>
            )}
            {inputOpen === "video" && (
              <div className="relative flex flex-row mt-2">
                <BiVideo
                  size={20}
                  color="gray"
                  className="absolute left-2 top-2"
                />
                <input
                  id="video"
                  type="text"
                  placeholder="YouTube, ニコニコ, bilibili"
                  value={url.video}
                  onChange={(e) =>
                    setURL({
                      ...url,
                      video: e.target.value,
                    })
                  }
                  className="py-1 pl-8 rounded-l"
                />
                <button
                  onClick={() => addOther("video")}
                  className="bg-gray-200 px-3 duration-100 hover:bg-gray-300 rounded-r"
                >
                  動画を取得
                </button>
              </div>
            )}
            {inputOpen === "internal" && (
              <div className="relative flex flex-row mt-2">
                <BiLinkAlt
                  size={20}
                  color="gray"
                  className="absolute left-2 top-2"
                />
                <input
                  id="internal"
                  type="text"
                  placeholder="MoisskeyのまとめURL"
                  value={url.internal}
                  onChange={(e) =>
                    setURL({
                      ...url,
                      internal: e.target.value,
                    })
                  }
                  className="py-1 pl-8 rounded-l"
                />
                <button
                  onClick={() => addOther("internal")}
                  className="bg-gray-200 px-3 duration-100 hover:bg-gray-300 rounded-r"
                >
                  取得
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="h-full min-w-full lg:min-w-0">
          <div className="h-5/6 border overflow-y-scroll">
            <div className="px-4 py-2 border-b border-gray-200">
              <h2 className="font-semibold">
                <Link href="/">
                  <Image
                    src="/img/moisskey.svg"
                    alt="Moisskey"
                    width={146}
                    height={26}
                  />
                </Link>
              </h2>
            </div>
            <div className="px-4 my-4">
              <div className="flex flex-col gap-2">
                <label
                  className="font-semibold pl-2 border-l-4 border-black"
                  htmlFor="title"
                >
                  まとめのタイトル
                </label>
                <textarea
                  id="title"
                  name="title"
                  placeholder="タイトルを入力してください。"
                  value={summary.title}
                  onChange={(e) =>
                    setSummary({ ...summary, title: e.target.value })
                  }
                  className="rounded py-1 px-2 text-sm focus:border-lime-500 focus:ring-lime-500"
                ></textarea>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label
                  className="font-semibold pl-2 border-l-4 border-black"
                  htmlFor="description"
                >
                  簡単な解説文
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={summary.description}
                  onChange={(e) =>
                    setSummary({ ...summary, description: e.target.value })
                  }
                  placeholder="簡単な解説文を入力してください。"
                  className="rounded py-1 px-2 text-sm focus:border-lime-500 focus:ring-lime-500"
                ></textarea>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label
                  className="font-semibold pl-2 border-l-4 border-black"
                  htmlFor="tags"
                >
                  タグの設定
                </label>
                <textarea
                  id="tags"
                  name="tags"
                  value={summary.tags.join(",")}
                  onChange={(e) =>
                    setSummary({ ...summary, tags: e.target.value.split(",") })
                  }
                  placeholder="タグを入力してください。カンマ（,）区切りで複数入力できます。"
                  className="rounded py-1 px-2 text-sm focus:border-lime-500 focus:ring-lime-500"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold pl-2 border-l-4 border-black">
                  サムネイルの設定
                </label>
                <p className="text-sm">サムネイルを選択する</p>
                <div className="flex items-center flex-wrap gap-1">
                  {thumbnail.map((tm, i) => (
                    <button
                      onClick={() => setSummary({ ...summary, thumbnail: tm })}
                      key={tm}
                      className={
                        summary.thumbnail === tm
                          ? "border-lime-500 border-2"
                          : "border-gray-300 border-2"
                      }
                    >
                      <img
                        alt={`thumbnail ${i}`}
                        src={tm}
                        className="w-20 h-20 object-cover aspect-square"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold pl-2 border-l-4 border-black">
                  公開範囲
                </label>
                <label className="text-sm">
                  <input
                    type="radio"
                    name="publish"
                    value="public"
                    onChange={() =>
                      setSummary({
                        ...summary,
                        hidden: "PUBLIC",
                      })
                    }
                    checked={summary.hidden === "PUBLIC"}
                    className="mr-1 text-lime-500 focus:ring-lime-500"
                  />
                  公開
                </label>
                <label className="text-sm">
                  <input
                    type="radio"
                    name="publish"
                    value="unlisted"
                    checked={summary.hidden === "UNLISTED"}
                    onChange={(e) =>
                      setSummary({
                        ...summary,
                        hidden: "UNLISTED",
                      })
                    }
                    className="mr-1 text-lime-500 focus:ring-lime-500"
                  />
                  限定公開
                </label>
                <label className="text-sm">
                  <input
                    type="radio"
                    name="publish"
                    value="private"
                    checked={summary.hidden === "PRIVATE"}
                    onChange={(e) =>
                      setSummary({
                        ...summary,
                        hidden: "PRIVATE",
                      })
                    }
                    className="mr-1 text-lime-500 focus:ring-lime-500"
                  />
                  非公開
                </label>
                <p className="text-sm">
                  限定公開はリンクを知っている人のみが見れます。
                </p>
              </div>
              {/*<div className="flex flex-col gap-2 mt-3">
                <label className="font-semibold pl-2 border-l-4 border-black">
                  その他
                </label>
                <label className="text-sm">
                  <input
                    type="checkbox"
                    name="toc"
                    value="toc"
                    className="mr-1 text-lime-500 focus:ring-lime-500"
                  />
                  目次を表示する
                </label>
                  </div>*/}
            </div>
          </div>
          <div className="border h-1/6 text-sm text-center font-semibold flex flex-col items-center justify-center">
            <button
              onClick={() => saveDraft()}
              className="mx-auto block rounded text-center bg-gray-200 duration-100 hover:bg-gray-300 py-2 w-80 my-2"
            >
              下書きを保存して閉じる
            </button>
            <button
              onClick={() => publishSummary()}
              className="mx-auto block rounded text-center bg-lime-500 duration-100 hover:bg-lime-600 text-white py-2 w-80 my-2"
            >
              まとめを投稿する
            </button>
          </div>
        </div>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="relative w-full max-w-4xl min-h-[50vh] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Editor ref={editorRef} />
                    <div className="absolute right-5 bottom-5 flex items-center gap-3">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="bg-gray-200 duration-100 hover:bg-gray-300 px-4 py-2 rounded"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={() => addText()}
                        className="bg-lime-500 duration-100 hover:bg-lime-600 text-white px-4 py-2 rounded"
                      >
                        保存
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        <ImageDialog />
        <UrlsDialog getNotes={getNotes} />
        <Toaster position="bottom-right" />
        <DragOverlay>
          {dragging
            ? (() => {
                if (dragging.type === "note") {
                  return (
                    <Note
                      id={dragging.id}
                      mkey={dragging.id}
                      note={dragging}
                      active={false}
                    />
                  );
                } else if (dragging.type === "url") {
                  return <Embed mkey={dragging.id} data={dragging} />;
                } else if (dragging.type === "video") {
                  return <Video mkey={dragging.id} data={dragging} />;
                } else if (dragging.type === "text") {
                  return <Text mkey={dragging.id} data={dragging} />;
                } else if (dragging.type === "image") {
                  return <MImage mkey={dragging.id} data={dragging} />;
                } else if (dragging.type === "internal") {
                  return <Internal mkey={dragging.id} data={dragging} />;
                }
              })()
            : null}
        </DragOverlay>
      </main>
    </DndContext>
  );
}

export const getServerSideProps = setup(
  async (ctx: GetServerSidePropsContext) => {
    const jwtToken = getCookie("mi-auth.token", { req: ctx.req, res: ctx.res });
    if (!jwtToken) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    //@ts-ignore
    const { uid } = jwt.verify(jwtToken, process.env.MIAUTH_KEY);
    const user = await prisma.user.findUnique({
      where: {
        id: uid,
      },
    });
    if (!user || user.suspend) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        summaryId: ctx.query.summaryId || "",
      },
    };
  }
);
