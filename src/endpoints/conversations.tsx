import { get, remove } from '../api/http';

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ConversationDetail {
  id: number;
  messages: Message[];
}

export function getConversationDetail(id: number) {
  return get<ConversationDetail>(`/conversations/${id}/`);
}

export function deleteConversation(id: number) {
    return remove(`/conversations/${id}/`)
}