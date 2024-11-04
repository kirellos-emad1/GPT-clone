import { chatsAtom, openAISettingsAtom } from "@/atoms/chat";
import { useAuth } from '@/context/AuthContext';
import { useAtom, useAtomValue } from "jotai";
import { ChatWithMessageCountAndSettings } from "@/types/collections";

import { useRouter } from "next/navigation";
import { Chat } from "openai/resources/index.mjs";
import { useEffect } from "react";
import useSWR from "swr";

interface AdvancedSettings {
    temperature?: number;
    max_tokens?: number;
    model?: string;
}

interface ChatWithMessages extends Chat  {
    _count: {
        messages: number;
    };
    
}

const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch chats');
    }
    const data =  await response.json();
    return data.formattedChats
};

const useChats = () => {
    // Auth & Router
    const { user } = useAuth();
    const router = useRouter();

    // States
    const openAISettings = useAtomValue(openAISettingsAtom);
    const [chats, setChats] = useAtom(chatsAtom);

    // SWR Hook
    const { data, error, isLoading, mutate } = useSWR<ChatWithMessageCountAndSettings[], Error>(
        user ? '/api/chats/fetching-chat' : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 10000,
            onError: (err) => {
                console.log('SWR Error:', err);
            }
        }
    );

    // Add New Chat Handler
    const addChatHandler = async () => {
        if (!user?.id) {
            console.log('Authenticate first');
            return;
        }

        try {
            const response = await fetch('/api/new-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: openAISettings.model,
                    system_prompt: openAISettings.system_prompt,
                    advanced_settings: openAISettings.advanced_settings,
                    history_type: openAISettings.history_type,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newChat = await response.json();

            // Add it to the top of the list
            mutate((prev) => [newChat, ...(prev ?? [])], false);

            // Redirect to the new chat
            router.push(`/chat/${newChat.id}?new=true`);
        } catch (error) {
            console.error("An unexpected error occurred:", error);
            // You might want to add proper error handling here
        }
    };
    console.log(chats)
    // Update chats atom when data changes
    useEffect(() => {
        if (data) {
            setChats(data??[]);
        }
    }, [data, setChats]);

    return {
        chats,
        isLoading,
        error,
        mutate,
        addChatHandler,
    };
};

export default useChats;