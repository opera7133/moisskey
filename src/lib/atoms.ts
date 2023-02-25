import { atom } from "jotai"
import type { NoteType, TextType, DataType, DataTypeNullable } from "@/types/note.d";
import type { User } from "@prisma/client"

export const notesAtom = atom<Array<NoteType>>([])
export const activesAtom = atom<
  (DataType)[]
>([])
export const imageDialogAtom = atom<
  (DataTypeNullable)
>(null)
export const urlsDialogAtom = atom<[boolean, Array<string>]>([false, []])
export const editorAtom = atom<TextType | null>(null)
export const userAtom = atom<User | null>(null)