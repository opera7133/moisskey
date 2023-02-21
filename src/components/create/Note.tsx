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
import { activesAtom, notesAtom, userAtom } from "@/lib/atoms";
import { useState } from "react";

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
  const [user] = useAtom(userAtom);
  const [fileIndex, setFileIndex] = useState(0);
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
  function updateImage() {
    if (fileIndex === note.files.length - 1) {
      setFileIndex(0);
    } else {
      setFileIndex(fileIndex + 1);
    }
  }
  if (note.renoteId && note.renote && !note.text)
    return (
      <>
        <div
          id={id}
          key={mkey}
          className="bg-white z-50 flex items-start justify-between"
        >
          <div className="flex gap-1 items-start text-sm px-2 pt-2 grow">
            <div className="relative shrink-0">
              <img src={note.renote.user.avatarUrl} className="rounded w-12" />
              <FaRetweet
                className="absolute bottom-0.5 right-0.5 bg-white p-0.5 rounded"
                size={18}
              />
            </div>
            <div className="w-full h-full flex flex-col justify-between">
              <div>
                <a
                  className="text-xs text-gray-500 flex items-center group"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://${note.renote?.user.host}/@${note.renote?.user.username}`}
                >
                  <span className="font-bold mr-1 flex gap-1 items-center duration-100 group-hover:text-lime-500">
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
                </a>
                <div className="flex items-start">
                  <div
                    className="w-full break-all whitespace-pre-wrap pr-4"
                    dangerouslySetInnerHTML={{
                      __html: note.renote.html || note.renote.text,
                    }}
                  ></div>
                  {note.renote?.files[0] && (
                    <div className="relative w-24 h-24 aspect-square">
                      <img
                        key={note.renote?.files[0].id}
                        src={note.renote?.files[fileIndex].thumbnailUrl}
                        onClick={() => updateImage()}
                        className="w-24 h-24 aspect-square object-cover"
                      />
                      {note.renote?.files.length > 1 && (
                        <div className="absolute bg-black text-white font-bold bottom-0 right-0 text-xs px-2">
                          {fileIndex + 1} / {note.renote?.files.length}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={
                    note.renote?.uri
                      ? note.renote?.uri
                      : `https://${
                          note.renote?.user.host
                            ? note.renote?.user.host
                            : user?.origin
                        }/notes/${note.renote?.id}`
                  }
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
          <img src={note.user.avatarUrl} className="rounded w-12" />
          <div className="w-full h-full flex flex-col justify-between">
            <div>
              <a
                className="text-xs text-gray-500 flex items-center group"
                rel="noopener noreferrer"
                target="_blank"
                href={`https://${note.user.host}/@${note.user.username}`}
              >
                <span className="font-bold mr-1 flex gap-1 items-center duration-100 group-hover:text-lime-500">
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
              </a>
              <div className="flex items-start">
                <div
                  className="w-full pr-4"
                  dangerouslySetInnerHTML={{
                    __html: note.renote
                      ? (note.html || note.text) +
                        (note.renote &&
                          `<a
                              class="text-blue-500 duration-100 hover:underline hover:text-blue-700"
                              target="_blank"
                              rel="noopener noreferrer"
                              href=${
                                note.renote?.uri
                                  ? note.renote.uri
                                  : `https://${note.renote?.user.host}/notes/${note.renote?.id}`
                              }
                            >
                            ${
                              note.renote?.uri
                                ? note.renote.uri
                                : `https://${note.renote?.user.host}/notes/${note.renote?.id}`
                            }
                            </a>`)
                      : note.html || note.text,
                  }}
                ></div>
                {note.files[0] && (
                  <div className="relative w-24 h-24 aspect-square">
                    <img
                      key={note.files[0].id}
                      src={note.files[fileIndex].thumbnailUrl}
                      onClick={() => updateImage()}
                      className="w-24 h-24 aspect-square object-cover"
                    />
                    {note.files.length > 1 && (
                      <div className="absolute bg-black text-white font-bold bottom-0 right-0 text-xs px-2">
                        {fileIndex + 1} / {note.files.length}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={
                  note.uri
                    ? note.uri
                    : `https://${
                        note.user.host ? note.user.host : user?.origin
                      }/notes/${note.id}`
                }
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
