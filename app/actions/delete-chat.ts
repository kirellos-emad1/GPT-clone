'use server'

import { db } from "@/lib/db";
import { redirect, RedirectType } from "next/navigation";


export async function deleteChat(
  id: string, 
) {
    try {
    await db.message.deleteMany({
        where:{chat_id:id}
    })
    await db.chat.delete({
      where: { id },
    });

    // Revalidate the chat page to reflect changes
     return redirect('/', RedirectType.replace)
} catch (error) {
    console.error('Error deleting chat:', error);
  }
}
