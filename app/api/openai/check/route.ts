import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import OpenAI from "openai";
export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<Response> {
  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json(
        { message: "API key is required!" }, 
        { status: 400 }
      );
    }

    // Create Supabase Server Client
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Authorization check
    if (!user) {
      return NextResponse.json(
        { message: "Not authorized!" }, 
        { status: 401 }
      );
    }

    // Initialize OpenAI client
    const openaiClient = openai

    try {
      // Test the API key by making a simple models request
      await openaiClient.models.list();

      return NextResponse.json(
        { message: "API key is valid!" },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        if (error.status === 401) {
          return NextResponse.json(
            { message: "Invalid API key provided." },
            { status: 401 }
          );
        }
        
        return NextResponse.json(
          { 
            message: "OpenAI API error",
            details: error.message 
          },
          { status: error.status || 500 }
        );
      }

      throw error; // Re-throw unexpected errors
    }
  } catch (error) {
    console.error('Validation error:', error);
    
    return NextResponse.json(
      { 
        message: "An unexpected error occurred",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}