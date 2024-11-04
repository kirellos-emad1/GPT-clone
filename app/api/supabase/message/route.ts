import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { Message } from "@prisma/client";
export const dynamic = 'force-dynamic';

// POST
export async function POST(req: Request): Promise<Response> {
  const { messages }:{messages:Message[]} = await req.json();

  // If no message, return 400
  if (!messages) {
    return new Response("No message!", { status: 400 });
  }

  // Get session
  const supabase = await createClient()
  const{data:{user}} = await supabase.auth.getUser()
  // If no session, return 401
  if (!user) {
    return new Response("Not authorized!", { status: 401 });
  }

  try {
    // Insert Messages using Prisma
    await db.message.createMany({
      data: messages.map((message: Message) => ({
        chat_id: message.chat_id,
        content: message.content,
        role: message.role,
        owner_id: user.id,
        embedding: message.embedding ? Buffer.from(message.embedding) : null,
        token_size: message.token_size,
      })),
    });

    // Fetch the inserted messages to return them
    const messagesInserted = await db.message.findMany({
      where: {
        chat_id: messages[0].chat_id,
        owner_id: user.id,
      },
      select: {
        id: true,
        role: true,
        content: true,
      },
    });
    return NextResponse.json(messagesInserted);
  } catch (error) {
    console.error(error);
    return new Response(error instanceof Error ? error.message : "Database error", { status: 400 });
  }
}

 // DELETE (Changed from PATCH to DELETE to match the operation)
export async function PATCH(req: Request): Promise<Response> {
  const {messageId} = await req.json();
   //If no ID, return 400
   if (!messageId) {
     return new Response("No ID!", { status: 400 });
   }

 //  Get session
  const supabase = await createClient()
  const{data:{user}} = await supabase.auth.getUser()
  // If no session, return 401
  if (!user) {
    return new Response("Not authorized!", { status: 401 });
  }

  try {
    await db.message.deleteMany({
      where: {
        id: messageId,
        owner_id: user.id,
      },
    });

    return new Response("Message deleted!", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error instanceof Error ? error.message : "Database error", { status: 400 });
  }
}