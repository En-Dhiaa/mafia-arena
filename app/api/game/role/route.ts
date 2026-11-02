import { NextResponse } from 'next/server';
import { roomStore } from '@/lib/game-engine/room-store';

export async function POST(req: Request) {
  try {
    const { code, guestToken } = await req.json();
    if (!code || !guestToken) {
      return NextResponse.json({ error: 'Missing code or token' }, { status: 400 });
    }

    const roleInfo = roomStore.getPlayerRole(code, guestToken);
    return NextResponse.json({ success: true, ...roleInfo });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
