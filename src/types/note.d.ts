export interface URLType {
  type: "url";
  id: string;
  url: string;
  og?: {
    title: string;
    image: string;
    description: string;
  }
}

export interface ImageType {
  type: "image";
  id: string;
  url: string;
  alt?: string;
  title?: string;
  quote?: string;
}

export interface TextType {
  type: "text"
  id: string;
  data: string;
}

export interface NoteType {
  type: "note";
  id: string;
  createdAt: Date;
  userId: string;
  user: User;
  text: string;
  cw: null;
  visibility: "public" | "home" | "followers" | "specified";
  localOnly: boolean;
  renote?: NoteType;
  renoteCount: number;
  repliesCount: number;
  reactions: any;
  reactionEmojis: any;
  emojis: any;
  fileIds: any[];
  files: any[];
  replyId?: string;
  renoteId?: string;
  uri: string;
}

interface UserType {
  id: string;
  name: string;
  username: string;
  host: string;
  avatarUrl: string;
  avatarBlurhash: string;
  isBot: boolean;
  isCat: boolean;
  instance: Instance;
  emojis: any;
  onlineStatus: string;
}

interface InstanceType {
  name: string;
  softwareName: string;
  softwareVersion: string;
  iconUrl: string;
  faviconUrl: string;
  themeColor: string;
}