import { NextResponse } from 'next/server';
import { roomStore } from '@/lib/game-engine/room-store';

export async function POST(req: Request) {
  try {
    const { code, guestToken, target_player_id } = await req.json();

    if (!code || !guestToken || !target_player_id) {
      return NextResponse.json({ error: 'Missing vote parameters' }, { status: 400 });
    }

    const result = roomStore.castVote(code, guestToken, target_player_id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

