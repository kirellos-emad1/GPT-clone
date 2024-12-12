import ChatInput from '@/components/chat/ChatInput'
import NewChat from '@/components/chat/NewChat'
import MobileMenuButton from '@/components/navigation/MobileMenuButton'
import React from 'react'

const Chat = () => {
    return (
        <main className="relative flex flex-col items-stretch flex-1 w-full h-full ml-0 overflow-hidden transition-all transition-width md:ml-64 dark:bg-neutral-900 bg-neutral-50">
            <div className="flex-1 overflow-hidden">
                <MobileMenuButton />
                <NewChat />
                <ChatInput />
            </div>
        </main>
    )
}

export default Chat