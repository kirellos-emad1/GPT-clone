// app/actions/chat.ts
'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ChatUpdateData = {
  system_prompt?: string;
  model?: "gpt-3.5-turbo" | "gpt-4";
  history_type?: "global" | "chat";
};

export async function getAllMEssagesByOwnerId(
  owner_id: string, 
  chat_id:string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.message.findMany({
      where: { owner_id, chat_id }
    });


    return { success: true };
  } catch (error) {
    console.error('Error updating chat:', error);
    return {
      success: false,
      error: 'Failed to update chat. Please try again.'
    };
  }
}

// You can import and use it in your components like this:
// import { updateChat } from "@/app/actions/chat";
// const response = await updateChat(id, { system_prompt: "new prompt" });