"use client"
import { LogOut, RefreshCcw } from "lucide-react";
import { openAPIKeyHandlerAtom } from "@/atoms/chat";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useSetAtom } from "jotai";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const ProfileMenu = () => {
    const { theme, setTheme } = useTheme();
    const { user, signOut } = useAuth()
    const apiKeyHandler = useSetAtom(openAPIKeyHandlerAtom);

    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center w-full gap-3">
                <Avatar>
                    <AvatarImage src={user?.avatar_url ?? ""} />

                    <AvatarFallback>
                        {user?.name?.slice(0, 2).toLocaleUpperCase() ?? "UU"}
                    </AvatarFallback>
                </Avatar>
                <div className="text-left whitespace-nowrap">
                    <div>{user?.name}</div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full mb-2" side="top" align="start">
                <DropdownMenuLabel>
                    ChatGPT clone
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        setTheme(theme === "dark" ? "light" : "dark");
                    }}
                >
                    Change Theme
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        apiKeyHandler({
                            action: "remove",
                          });
                        router.push("/chat");
                    }}
                >
                    <div className="flex items-center gap-2">
                        <RefreshCcw size="14" /> Reset API Key
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                    <div className="flex items-center gap-2">
                        <LogOut size="14" /> Log Out
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileMenu;