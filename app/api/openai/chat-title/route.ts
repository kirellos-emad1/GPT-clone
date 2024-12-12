import { db } from "@/lib/db";
import openai from "@/lib/openai";
import { ChatGPTMessage } from "@/types/openai";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<Response> {
  const { messages, chatID } = await req.json();

  if (!messages) {
    return new Response("No messages!", { status: 400 });
  }

  if (!chatID) {
    return new Response("No chatID!", { status: 400 });
  }

  // Create Supabase Server Client
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, return 401
  if (!session) {
    return new Response("Not authorized!", { status: 401 });
  }

  // Create OpenAI Client

  const typeCorrectedMessages = messages as ChatGPTMessage[];

  // Get Conversation Title
  const response = await openai.chat.completions.create({
    model:"gpt-35-turbo",
    messages: [
      {
        content:
          "Based on the previous conversation, please write a short title for this conversation. RETURN ONLY THE TITLE.",
        role: "system",
      },
      ...typeCorrectedMessages,
    ],
  });

  const title = response.choices[0].message?.content;

  // If no title found, return 400
  if (!title) {
    return new Response("No response from OpenAI", { status: 401 });
  }

  // Update Chat Title
  await db.chat.update({
    where: {id: chatID},
    data:{title}
  })
  // Finally return title
  return NextResponse.json({
    title,
  });
}