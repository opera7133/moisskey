import { atom } from "jotai"
import type { NoteType, TextType, URLType, ImageType } from "@/types/note.d";
import type { User } from "@prisma/client"

export const notesAtom = atom<Array<NoteType>>([])
export const activesAtom = atom<
  (NoteType | TextType | URLType | ImageType)[]
>([])
export const dialogAtom = atom<
  (NoteType | TextType | URLType | ImageType | null)
>(null)
export const editorAtom = atom<TextType | null>(null)
export const userAtom = atom<User | null>(null)