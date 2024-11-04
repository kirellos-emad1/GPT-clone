"use client";

import { chatboxRefAtom, messagesAtom } from "@/atoms/chat";
import { useAtomValue } from "jotai";
import Message from "./Message";
import { ChatWithMessageCountAndSettings, MessageT } from "@/types/collections";
import useChat from "@/hooks/useChat";

const Messages = () => {
  const containerRef = useAtomValue(chatboxRefAtom);
  const messages = useAtomValue(messagesAtom);

  return (
    <div ref={containerRef} className="h-full overflow-y-scroll">
      {messages.map((message:any, index) => (
        <Message key={index} message={message} />
      ))}
    </div>
  );
};

export default Messages;