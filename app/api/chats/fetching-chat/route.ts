
import { db } from '@/lib/db'; // Adjust import path as needed
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
export  async function GET(
  req: Request,
) {


  try {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()
    if (!user?.id) {
      return NextResponse.json({ message: 'Unauthorized'}, {status:401});
    }

    const chats = await db.chat.findMany({
      where: { 
        owner_id: user.id,
      },
      include: {
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const formattedChats = chats.map((chat) => {
      let parsedSettings = {};
      try {
        parsedSettings = chat.advanced_settings 
          ? JSON.parse(chat.advanced_settings as string)
          : {};
      } catch (error) {
        console.error(`Failed to parse settings for chat ${chat.id}:`, error);
      }

      return {
        ...chat,
        advanced_settings: parsedSettings,
      };
    });

    return NextResponse.json({formattedChats}, {status:200});
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ message: 'Internal server error' },{status:200});
  }
}

