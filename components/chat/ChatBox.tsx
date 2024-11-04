"use client";
import { currentChatHasMessagesAtom } from "@/atoms/chat";
import useChat from "@/hooks/useChat";
import { ChatWithMessageCountAndSettings } from "@/types/collections";
import { useAtomValue } from "jotai";
import ChatInput from "./ChatInput";
import NewChatCurrent from "./NewChatCurrent";

import Messages from "./Massages";

const Chatbox = ({
  currentChat,
  initialMessages,
}: {
  currentChat: ChatWithMessageCountAndSettings;
  initialMessages: any;
}) => {
  const hasChatMessages = useAtomValue(currentChatHasMessagesAtom);
  useChat({ currentChat, initialMessages });

  return (
    <main className="relative flex flex-col items-stretch flex-1 w-full h-full ml-0 overflow-hidden transition-all transition-width md:ml-64 dark:bg-neutral-900 bg-neutral-50">
      <div className="flex-1 overflow-hidden">
      {hasChatMessages ? <Messages /> : <NewChatCurrent />}
        <ChatInput />
      </div>
    </main>
  );
};

export default Chatbox;