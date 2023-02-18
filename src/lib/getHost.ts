import { NoteType } from "@/types/note"

export const getHost = (note: NoteType, origin: string) => {
  let url = ""
  if (note.renoteId) {
    url = note.renote?.user.host
      ? note.renote?.user.host
      : new URL(origin).hostname
  } else {
    url = note.user.host
      ? note.user.host
      : new URL(origin).hostname
  }
  return url
}