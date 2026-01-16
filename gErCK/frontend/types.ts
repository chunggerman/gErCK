export interface Source {
  title: string;
  chunk: string;
  id: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}
