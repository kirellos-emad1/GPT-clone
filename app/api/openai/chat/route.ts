import { OpenAIStream } from "@/lib/openai-stream";
import { OpenAIStreamPayload } from "@/types/openai";
import { createClient } from "@/utils/supabase/server";

export const config = {
  runtime: 'edge', // or 'nodejs'
};

export async function POST(req: Request): Promise<Response> {
  const { payload:{model, messages} } = await req.json();

  // Create Supabase Server Client
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, return 401
  if (!session) {
    return new Response("Not authorized!", { status: 401 });
  }

  const payload:any = {
    model,
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    n: 1,
  };

  const stream = await OpenAIStream(payload);

  return new Response(stream);
}