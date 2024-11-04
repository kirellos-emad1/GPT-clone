"use client";

import React from 'react'
import { Menu } from "lucide-react";
import { Button } from '../ui/button';
import { currentChatAtom } from "@/atoms/chat";
import { useAtomValue } from "jotai";



interface MobileProps {
    showMenu: boolean
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}



const MobileMenuButton: React.FC<MobileProps> = ({ showMenu, setShowMenu }) => {
    const currentChat = useAtomValue(currentChatAtom);

    return (
        <div className="sticky top-0 left-0 right-0 flex px-4 py-2 bg-transparent dark:bg-neutral-900 sm:px-8 md:hidden">
            <Button
                title="Mobile Menu"
                className="-ml-4"
                onClick={() => {
                    setShowMenu((prev) => !prev);
                }}
                variant="ghost"
            >
                <Menu />
            </Button>
            {/* Current Chat Name */}
            <div className="w-full mr-10 text-center bg-transparent">
                <h1 className="text-sm font-medium dark:text-neutral-600">
                {currentChat?.title}
                </h1>
            </div>
        </div>
    )
}

export default MobileMenuButton