'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";


export async function deleteChat(
  id: string, 
) {
    console.log(id)
    try {
    await db.message.deleteMany({
        where:{chat_id:id}
    })
    await db.chat.delete({
      where: { id },
    });

    // Revalidate the chat page to reflect changes
     console.log('chat deleted')
     return redirect('/', RedirectType.replace)
} catch (error) {
    console.error('Error deleting chat:', error);
  }
}
