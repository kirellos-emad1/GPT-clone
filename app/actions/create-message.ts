import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

async function getMessagesAndChat(id: string) {
  // Get messages for the chat
  const messages = await db.message.findMany({
    where: {
      chat_id: id
    },
    orderBy: [
      {
        created_at: 'asc'
      },
      {
        role: 'desc'
      }
    ]
  });

  // Get chat with message count
  const currentChat = await db.chat.findUnique({
    where: {
      id: id
    },
    include: {
      _count: {
        select: {
          messages: true
        }
      }
    }
  });

  if (!currentChat) {
    notFound();
  }

  return { messages, currentChat };
}