import { format } from "date-fns";
import type { NoteType } from "@/types/note.d";
import {
  FaRetweet,
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
} from "react-icons/fa";
import reactStringReplace from "react-string-replace";
import { useAtom } from "jotai";
import { activesAtom, notesAtom } from "@/lib/atoms";

export default function Note({
  id,
  mkey,
  note,
  active = false,
}: {
  id: string;
  mkey: string;
  note: NoteType;
  active?: boolean;
}) {
  const [notes, setNotes] = useAtom(notesAtom);
  const [actives, setActives] = useAtom(activesAtom);
  function moveToActive(nid: string) {
    const target = notes.findIndex((nt) => nt.id === nid);
    setActives([...actives, notes[target]]);
    setNotes(notes.filter((nt) => nt.id !== nid));
  }
  function moveUp(nid: string, from: "note" | "active") {
    if (from === "note") {
      const target = notes.findIndex((nt) => nt.id === nid);
      const targetNote = notes[target];
      const replaceNote = target === 0 ? notes[target] : notes[target - 1];
      setNotes(
        notes.map((nt, i) => {
          if (i === target) return replaceNote;
          if (i === target - 1) return targetNote;
          return nt;
        })
      );
    } else {
      const target = actives.findIndex((at) => {
        if (at.type === "note") return at.id === nid;
      });
      const targetNote = actives[target];
      const replaceNote = target === 0 ? actives[target] : actives[target - 1];
      setActives(
        actives.map((at, i) => {
          if (i === target) return replaceNote;
          if (i === target - 1) return targetNote;
          return at;
        })
      );
    }
  }
  function moveDown(nid: string, from: "note" | "active") {
    if (from === "note") {
      const target = notes.findIndex((nt) => nt.id === nid);
      const targetNote = notes[target];
      const replaceNote =
        target === notes.length - 1 ? notes[target] : notes[target + 1];
      setNotes(
        notes.map((nt, i) => {
          if (i === target) return replaceNote;
          if (i === target + 1) return targetNote;
          return nt;
        })
      );
    } else {
      const target = actives.findIndex((at) => {
        if (at.type === "note") return at.id === nid;
      });
      const targetNote = actives[target];
      const replaceNote =
        target === actives.length - 1 ? actives[target] : actives[target + 1];
      setActives(
        actives.map((at, i) => {
          if (i === target) return replaceNote;
          if (i === target + 1) return targetNote;
          return at;
        })
      );
    }
  }
  function moveToNote(nid: string) {
    const target = actives.findIndex((at) => {
      if (at.type === "note") return at.id === nid;
    });
    const targetNote = actives[target];
    if (targetNote.type === "note") {
      setNotes([targetNote, ...notes]);
    }
    setActives(
      actives.filter((at) => {
        if (at.type === "note") return at.id !== nid;
        return true;
      })
    );
  }
  function deleteFrom(nid: string, from: "note" | "active") {
    if (from === "note") {
      setNotes(notes.filter((nt) => nt.id !== nid));
    } else {
      setActives(
        actives.filter((at) => {
          if (at.type === "note") return at.id !== nid;
          return true;
        })
      );
    }
  }
  if (note.renoteId && note.renote)
    return (
      <>
        <div
          id={id}
          key={mkey}
          className="bg-white z-50 flex items-start justify-between"
        >
          <div className="flex gap-1 items-start text-sm px-2 pt-2 grow">
            <div className="relative">
              <img
                src={note.renote.user.avatarUrl}
                width={50}
                className="rounded"
              />
              <FaRetweet
                className="absolute bottom-0.5 right-0.5 bg-white p-0.5 rounded"
                size={18}
              />
            </div>
            <div className="w-full h-full flex flex-col justify-between">
              <div>
                <div className="text-xs text-gray-500 flex items-center">
                  <span className="mr-1 flex gap-1 items-center">
                    {reactStringReplace(
                      note.renote.user.name,
                      /:([^:\s]*(?:::[^:\s]*)*):/,
                      (match, i) => (
                        <img
                          className="h-4"
                          key={i}
                          src={note.renote?.user.emojis[match]}
                        />
                      )
                    )}
                  </span>
                  <span>@{note.renote.user.username}</span>
                </div>
                <p className="break-all whitespace-pre-wrap">
                  {note.renote.text}
                </p>
              </div>
              <div className="text-right">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://misskey.vcborn.com"
                  className="text-gray-500 hover:text-lime-500 duration-100"
                >
                  <time className="text-xs">
                    {format(
                      new Date(note.renote.createdAt),
                      "yyyy/MM/dd kk:mm:ss"
                    )}
                  </time>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-center pt-2 px-1">
            <button
              className="group"
              onClick={() => deleteFrom(id, active ? "active" : "note")}
            >
              <FaTimes
                size={20}
                className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
              />
            </button>
            <button
              className="group"
              onClick={() => moveUp(id, active ? "active" : "note")}
            >
              <FaArrowUp
                size={20}
                className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
              />
            </button>
            {active ? (
              <button className="group" onClick={() => moveToNote(id)}>
                <FaArrowLeft
                  size={20}
                  className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
                />
              </button>
            ) : (
              <button className="group" onClick={() => moveToActive(id)}>
                <FaArrowRight
                  size={20}
                  className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
                />
              </button>
            )}
            <button
              className="group"
              onClick={() => moveDown(id, active ? "active" : "note")}
            >
              <FaArrowDown
                size={20}
                className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
              />
            </button>
          </div>
        </div>
        <hr className="border-dotted mt-2" />
      </>
    );
  return (
    <>
      <div
        id={id}
        key={mkey}
        className="bg-white z-50 flex items-start justify-between"
      >
        <div className="flex gap-1 items-start text-sm px-2 pt-2 grow">
          <img src={note.user.avatarUrl} width={50} className="rounded" />
          <div className="w-full h-full flex flex-col justify-between">
            <div>
              <div className="text-xs text-gray-500 flex items-center">
                <span className="mr-1 flex gap-1 items-center">
                  {reactStringReplace(
                    note.user.name,
                    /:([^:\s]*(?:::[^:\s]*)*):/,
                    (match, i) => (
                      <img
                        className="h-4"
                        key={i}
                        src={note.user.emojis[match]}
                      />
                    )
                  )}
                </span>
                <span>@{note.user.username}</span>
              </div>
              <p className="break-all whitespace-pre-wrap">{note.text}</p>
            </div>
            <div className="text-right">
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://misskey.vcborn.com"
                className="text-gray-500 hover:text-lime-500 duration-100"
              >
                <time className="text-xs">
                  {format(new Date(note.createdAt), "yyyy/MM/dd kk:mm:ss")}
                </time>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-center px-1 pt-2">
          <button
            className="group"
            onClick={() => deleteFrom(id, active ? "active" : "note")}
          >
            <FaTimes
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
          <button
            className="group"
            onClick={() => moveUp(id, active ? "active" : "note")}
          >
            <FaArrowUp
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
          {active ? (
            <button className="group" onClick={() => moveToNote(id)}>
              <FaArrowLeft
                size={20}
                className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
              />
            </button>
          ) : (
            <button className="group" onClick={() => moveToActive(id)}>
              <FaArrowRight
                size={20}
                className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
              />
            </button>
          )}
          <button
            className="group"
            onClick={() => moveDown(id, active ? "active" : "note")}
          >
            <FaArrowDown
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
        </div>
      </div>
      <hr className="border-dotted mt-2" />
    </>
  );
}
