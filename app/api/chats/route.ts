import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function GET(req: NextRequest) {
    const userId = req.headers.get('user-id'); // Assume this is passed in headers
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const chats = await db.chat.findMany({
            where: { owner_id: userId },
            include: {
                _count: {
                    select: { messages: true }
                }
            },
            orderBy: { created_at: 'desc' },
        });
        return NextResponse.json(chats);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const userId = req.headers.get('user-id');
    const { model, system_prompt, advanced_settings,  title } = await req.json();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const newChat = await db.chat.create({
            data: {
                owner_id: userId,
                title: title || 'New Conversation',
                model,
                system_prompt,
                advanced_settings: JSON.stringify(advanced_settings),
            },
        });
        return NextResponse.json(newChat);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
