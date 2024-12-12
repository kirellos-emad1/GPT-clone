"use client"
import React, { useEffect, useState } from 'react'
import { Plus, Menu } from "lucide-react";
import ProfileMenu from './ProfileMenu';
import { Button } from "../ui/button";
import Chats from "../chat/Chats";
import { mobileMenuAtom } from "@/atoms/navigation";
import { useAtom } from "jotai";

import useChats from '@/hooks/useChats';

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMobileMenuOpen, showMobileMenu] = useAtom(mobileMenuAtom);

  const { addChatHandler } = useChats();


  useEffect(() => {
    // Function to check window size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 w-64 px-4 py-8 transition-transform -translate-x-full shadow-md md:translate-x-0 dark:border-neutral-900 border-neutral-200 bg-white dark:bg-neutral-900 dark:text-neutral-50 ${
        isMobileMenuOpen ? " !translate-x-0" : " "
      }`}
    >

      <div className="flex flex-col flex-1 h-full max-w-full">
        {/* Header */}
        <div>
          {isMobile && isMobileMenuOpen && (
            <Button
              title="Close Menu"
              className="-ml-2 -mt-4"
              onClick={() => {
                showMobileMenu(false);
              }}
              variant='ghost'
            >
              <Menu />

            </Button>
          )}
          {/* New Chat Button */}
          <Button
          title='New Chat'
            onClick={() => {
              addChatHandler();
              showMobileMenu(false);
            }}
            className="flex-shrink-0 bg-neutral-600 flex items-center gap-2 w-full mt-8 sm:mt-16"
          >
            New Chat <Plus size="16" />
          </Button>
        </div>
        <Chats />

        {/* Footer */}
        <div className="flex-1 mt-10">
          <ProfileMenu />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar