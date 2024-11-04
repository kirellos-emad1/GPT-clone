// pages/api/chats.js
import { db } from "@/lib/db"; // Ensure this path is correct
import { createClient } from "@/utils/supabase/server";
import { Chat } from "@prisma/client";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
  
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
        }
        const data:Chat = await request.json();
        const { model, system_prompt, advanced_settings, history_type} = data
        try {
            const newChat = await db.chat.create({
                data: {
                    owner_id: user.id,
                    model,
                    system_prompt,
                    advanced_settings: JSON.stringify(advanced_settings),
                    history_type,
                    title: "New Conversation",
                },
                include: { messages: { select: { id: true, Chat:true,chat_id:true,content:true,created_at:true,embedding:true,owner_id:true,pair:true, role:true,token_size:true,User:true } } }
            });
            return NextResponse.json(newChat, {status:201});
        } catch (error) {
            return NextResponse.json({ message: "Failed to create chat", error},{status:500});
        }
    
}
