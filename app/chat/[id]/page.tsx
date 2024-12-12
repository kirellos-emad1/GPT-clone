import Chatbox from "@/components/chat/ChatBox";
import { db } from "@/lib/db";
import { ChatWithMessageCountAndSettings } from "@/types/collections";
import { notFound } from "next/navigation";
export const revalidate = 0;
type tParams = Promise<{ id: string }>;


const ChatPage = async (props: { params: tParams }) => {
    // Get Initial Messages
    const  {id}= await props.params;

    const messages = await db.message.findMany(
        {
            where: {
                chat_id: id
            },
            select: {
                id: true,
                chat_id: true,
                Chat: true,
                content: true,
                created_at: true,
                owner_id: true,
                role: true,
                token_size: true,
                child_messages:{
                    select: {
                        id: true,
                        content: true,
                        created_at: true,
                        owner_id: true,
                        role: true,
                        parent_message_id:true,
                    },
                },
                pair: true,
            },
            orderBy: [
                { created_at: 'asc' },
                { role: 'desc' }
            ],
        }
    )

    // Check if the chat exists, if not, return 404
    const currentChat = await db.chat.findUnique({
        where: { id },
        include: {
            _count: {
                select:
                {
                    messages: true
                }
            }
        },
    });
    if (!currentChat) {
        notFound();
    }
    const parsedCurrentChat = {
        ...currentChat,
        advanced_settings: JSON.parse(currentChat.advanced_settings as string),
    } as unknown as ChatWithMessageCountAndSettings;

    return (
        <Chatbox currentChat={parsedCurrentChat} initialMessages={messages ?? []} />
    );
};

export default ChatPage;