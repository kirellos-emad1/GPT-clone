import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request): Promise<Response> {
  const {
    query_embedding,
    similarity_threshold,
    match_count,
    owner_id,
    chat_id,
  } = await req.json();

  // Validate input

  if (!query_embedding || !similarity_threshold || !match_count || !owner_id) {
    return NextResponse.json("Wrong payload!", { status: 400 });
  }

  // Placeholder for authentication - implement your actual auth logic
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Not authorized!", { status: 401 });
  }

  try {
    // Using raw SQL query to calculate similarity
    const data = await db.$queryRaw(
      Prisma.sql`
      SELECT *
      FROM "Message"
      WHERE "chat_id" = ${chat_id}
        AND "owner_id" = ${user.id}
        AND cosine_similarity("embedding", ${query_embedding}) >= ${similarity_threshold}
      ORDER BY cosine_similarity("embedding", ${query_embedding}) DESC
      LIMIT ${match_count}
      `
    );

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  }
}