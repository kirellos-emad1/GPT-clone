import { ChatGPTAgent, ChatGPTMessage, OpenAISettings } from "./openai";
import { Prisma, Message, User, Chat } from "@prisma/client";

// Extend ChatGPTMessage for custom MessageI type
export interface MessageI extends ChatGPTMessage {
  id: string;
  createdAt: Date;
}

// Prisma-generated message type adjustment to Prisma Message model
export type MessageT = Omit<
  Message | any,
  "index" | "owner_id" | "embedding" | "pair"
> & {
  id:string;
  created_at:Date;
  index?: number;
  owner_id?: string;
  embedding?: string |null;
  pair?: string;
  role: string | ChatGPTAgent
};

// Adjust Profile and Chat interfaces using Prisma models directly
export type UserT = User;
export type ChatT = Chat;

// Chat type with custom fields and OpenAI settings adjustments
export interface ChatWithMessageCountAndSettings
  extends Omit<Chat, "advanced_settings" | "model" | "history_type">,
  Omit<OpenAISettings, "system_prompt"> {
  messages: any;
  _count: {
    messages: number;
  };
  advanced_settings: OpenAISettings["advanced_settings"];
  history_type: "chat" | "global";
}
