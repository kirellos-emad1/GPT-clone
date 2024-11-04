
import React from "react";
import Nav from "@/components/navigation/Nav";
import OpenAIServerKeyProvider from "@/context/OpenAiServerKey";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <OpenAIServerKeyProvider>
      
    <div className="relative flex w-full h-full overflow-hidden">
        <Nav/>
        {children}
      </div>
    </OpenAIServerKeyProvider>
  );
};

export default ChatLayout;