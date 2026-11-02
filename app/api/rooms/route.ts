import { NextResponse } from 'next/server';
import { roomStore } from '@/lib/game-engine/room-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { hostName, settings } = body;

    if (!hostName || typeof hostName !== 'string' || hostName.trim().length === 0) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم المضيف بشكل صحيح' },
        { status: 400 }
      );
    }

    const { code, guestToken, playerId } = roomStore.createRoom(hostName, settings);

    return NextResponse.json({
      success: true,
      code,
      guestToken,
      playerId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في إنشاء الغرفة' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rooms = roomStore.getAllActiveRooms();
    return NextResponse.json({ success: true, rooms });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

