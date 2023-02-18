import { format } from "date-fns";
import type { NoteType } from "@/types/note.d";
import reactStringReplace from "react-string-replace";
import reactElementToJSXString from "react-element-to-jsx-string";

export default function Note({ id, note }: { id: string; note: NoteType }) {
  if (note.renoteId && note.renote && !note.text) {
    return (
      <>
        <div id={id} className="bg-white z-50 flex items-start justify-between">
          <div className="flex gap-1 items-start text-sm px-2 pt-2 grow relative">
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={`https://${note.renote?.user.host}/@${note.renote?.user.username}`}
            >
              <img
                src={note.renote?.user.avatarUrl}
                width={55}
                className="rounded"
              />
            </a>
            <div className="w-full h-full flex flex-col justify-between">
              <div>
                <div className="text-xs text-gray-500 flex items-center">
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`https://${note.renote?.user.host}/@${note.renote?.user.username}`}
                    className="flex gap-1 items-center mr-1 group"
                  >
                    <span className="flex gap-1 items-center font-bold duration-100 group-hover:text-lime-500">
                      {reactStringReplace(
                        note.renote?.user.name,
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
                    <span>@{note.renote?.user.username}</span>
                  </a>
                </div>
                <div
                  className="break-all whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: note.renote.html || note.renote.text,
                  }}
                ></div>
                {note.renote?.files.map((file) => {
                  if (file.type.startsWith("video")) {
                    return (
                      <video
                        key={file.id}
                        controls
                        src={file.url}
                        className="my-2 border border-gray-200"
                      ></video>
                    );
                  } else if (file.type.startsWith("image")) {
                    return (
                      <img
                        key={file.id}
                        src={file.url}
                        className="my-2 border border-gray-200"
                      />
                    );
                  }
                })}
              </div>
              <div className="text-right">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={
                    note.renote?.uri ||
                    `https://${note.renote?.user.host}/notes/${note.renote?.id}`
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
            <a
              rel="noopener noreferrer"
              target="_blank"
              className="absolute top-2.5 right-2 w-4 h-4 fill-gray-300 duration-100 hover:fill-lime-500"
              href={
                note.renote?.uri ||
                `https://${note.renote?.user.host}/notes/${note.renote?.id}`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 146.24 102.49"
              >
                <path d="m17.84,0c-2.08,0-4.14.35-6.1,1.07-3.46,1.22-6.31,3.41-8.54,6.56C1.07,10.68,0,14.08,0,17.84v66.8c0,4.88,1.73,9.1,5.19,12.66,3.56,3.46,7.78,5.19,12.66,5.19s9.2-1.73,12.66-5.18c3.56-3.56,5.34-7.78,5.34-12.66v-12.15c.04-2.63,2.75-1.94,4.12,0,2.56,4.44,8,8.26,14.34,8.23h0c6.33-.02,11.59-3.15,14.34-8.23,1.04-1.22,3.97-3.31,4.27,0v12.15c0,4.88,1.73,9.1,5.18,12.66,3.56,3.46,7.78,5.19,12.66,5.19s9.2-1.73,12.66-5.18c3.56-3.56,5.34-7.78,5.34-12.66V17.84c0-3.76-1.12-7.16-3.35-10.21-2.14-3.16-4.94-5.34-8.39-6.56C94.97.35,92.94,0,90.9,0,85.41,0,80.78,2.14,77.02,6.41l-18.11,21.19c-.4.31-1.75,2.64-4.62,2.64s-4.05-2.33-4.46-2.63L31.57,6.41C27.91,2.14,23.34,0,17.84,0Zm112.84,0c-4.27,0-7.93,1.53-10.98,4.57-2.95,2.95-4.42,6.56-4.42,10.83s1.47,7.93,4.42,10.98c3.05,2.95,6.71,4.42,10.98,4.42s7.93-1.47,10.98-4.42c3.05-3.05,4.57-6.71,4.57-10.98s-1.52-7.88-4.57-10.83C138.62,1.53,134.96,0,130.69,0Zm.15,33.86c-4.27,0-7.93,1.53-10.98,4.57-3.05,3.05-4.57,6.71-4.57,10.98v37.67c0,4.27,1.52,7.93,4.57,10.98,3.05,2.95,6.71,4.42,10.98,4.42s7.88-1.47,10.83-4.42c3.05-3.05,4.57-6.71,4.57-10.98v-37.67c0-4.27-1.52-7.93-4.57-10.98-2.95-3.05-6.56-4.57-10.83-4.57Z" />
              </svg>
            </a>
          </div>
        </div>
        <hr className="mt-2" />
      </>
    );
  } else {
    return (
      <>
        <div id={id} className="bg-white z-50 flex items-start justify-between">
          <div className="flex gap-1 items-start text-sm px-2 pt-2 grow relative">
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={`https://${note.user.host}/@${note.user.username}`}
            >
              <img src={note.user.avatarUrl} width={55} className="rounded" />
            </a>
            <div className="w-full h-full flex flex-col justify-between">
              <div>
                <div className="text-xs text-gray-500 flex items-center">
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`https://${note.user.host}/@${note.user.username}`}
                    className="flex gap-1 items-center mr-1 group"
                  >
                    <span className="flex gap-1 items-center font-bold duration-100 group-hover:text-lime-500">
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
                </div>
                <div
                  className="break-all whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: note.renote
                      ? note.html ||
                        (note.text + note.renote &&
                          reactElementToJSXString(
                            <a
                              className="text-blue-500 duration-100 hover:underline hover:text-blue-700"
                              href={
                                note.renote?.uri
                                  ? note.renote.uri
                                  : `https://${note.renote?.user.host}/notes/${note.renote?.id}`
                              }
                            >
                              &nbsp;
                              {note.renote?.uri
                                ? note.renote.uri
                                : `https://${note.renote?.user.host}/notes/${note.renote?.id}`}
                            </a>
                          ))
                      : note.html || note.text,
                  }}
                ></div>
                {note.files.map((file) => {
                  if (file.type.startsWith("video")) {
                    return (
                      <video
                        key={file.id}
                        controls
                        className="my-2 border border-gray-200"
                        src={file.url}
                      ></video>
                    );
                  } else if (file.type.startsWith("image")) {
                    return (
                      <img
                        key={file.id}
                        className="my-2 border border-gray-200"
                        src={file.url}
                      />
                    );
                  }
                })}
              </div>
              <div className="text-right">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={
                    note.uri || `https://${note.user.host}/notes/${note.id}`
                  }
                  className="text-gray-500 hover:text-lime-500 duration-100"
                >
                  <time className="text-xs">
                    {format(new Date(note.createdAt), "yyyy/MM/dd kk:mm:ss")}
                  </time>
                </a>
              </div>
            </div>
            <a
              rel="noopener noreferrer"
              target="_blank"
              className="absolute top-2.5 right-2 w-4 h-4 fill-gray-300 duration-100 hover:fill-lime-500"
              href={note.uri || `https://${note.user.host}/notes/${note.id}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 146.24 102.49"
              >
                <path d="m17.84,0c-2.08,0-4.14.35-6.1,1.07-3.46,1.22-6.31,3.41-8.54,6.56C1.07,10.68,0,14.08,0,17.84v66.8c0,4.88,1.73,9.1,5.19,12.66,3.56,3.46,7.78,5.19,12.66,5.19s9.2-1.73,12.66-5.18c3.56-3.56,5.34-7.78,5.34-12.66v-12.15c.04-2.63,2.75-1.94,4.12,0,2.56,4.44,8,8.26,14.34,8.23h0c6.33-.02,11.59-3.15,14.34-8.23,1.04-1.22,3.97-3.31,4.27,0v12.15c0,4.88,1.73,9.1,5.18,12.66,3.56,3.46,7.78,5.19,12.66,5.19s9.2-1.73,12.66-5.18c3.56-3.56,5.34-7.78,5.34-12.66V17.84c0-3.76-1.12-7.16-3.35-10.21-2.14-3.16-4.94-5.34-8.39-6.56C94.97.35,92.94,0,90.9,0,85.41,0,80.78,2.14,77.02,6.41l-18.11,21.19c-.4.31-1.75,2.64-4.62,2.64s-4.05-2.33-4.46-2.63L31.57,6.41C27.91,2.14,23.34,0,17.84,0Zm112.84,0c-4.27,0-7.93,1.53-10.98,4.57-2.95,2.95-4.42,6.56-4.42,10.83s1.47,7.93,4.42,10.98c3.05,2.95,6.71,4.42,10.98,4.42s7.93-1.47,10.98-4.42c3.05-3.05,4.57-6.71,4.57-10.98s-1.52-7.88-4.57-10.83C138.62,1.53,134.96,0,130.69,0Zm.15,33.86c-4.27,0-7.93,1.53-10.98,4.57-3.05,3.05-4.57,6.71-4.57,10.98v37.67c0,4.27,1.52,7.93,4.57,10.98,3.05,2.95,6.71,4.42,10.98,4.42s7.88-1.47,10.83-4.42c3.05-3.05,4.57-6.71,4.57-10.98v-37.67c0-4.27-1.52-7.93-4.57-10.98-2.95-3.05-6.56-4.57-10.83-4.57Z" />
              </svg>
            </a>
          </div>
        </div>
        <hr className="mt-2" />
      </>
    );
  }
}
