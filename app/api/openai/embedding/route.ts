import {embeddingsClient} from "@/lib/openai";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<Response> {
  const { messages, apiKey } = await req.json();

  if (!messages) {
    return new Response("No messages!", { status: 400 });
  }

  if (!apiKey) {
    return new Response("No key!", { status: 400 });
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

  try {
    // Create Embeddings
    const { data } = await embeddingsClient.embeddings.create({
      model: "text-embedding-ada-002",
      input: messages
        .map((message: any) => message.content)
        .filter((filteredMessage: string) => filteredMessage !== ""),
    });

    const embeddings = data;

    if (!embeddings) {
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 500 }
      );
    }

    // Finally return title
    return NextResponse.json(embeddings);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}