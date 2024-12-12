
import React from "react";
import OpenAIServerKeyProvider from "@/context/OpenAiServerKey";
import Sidebar from "@/components/navigation/Sidebar";
import SidebarOverlay from "@/components/navigation/SidebarOverlay";
const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <OpenAIServerKeyProvider>
      <div className="relative flex w-full h-full overflow-hidden">
        <SidebarOverlay />
        <Sidebar />
        {children}
      </div>
    </OpenAIServerKeyProvider>
  );
};

export default ChatLayout;