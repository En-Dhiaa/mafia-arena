import { NextResponse } from 'next/server';
import { roomStore } from '@/lib/game-engine/room-store';

export async function POST(req: Request) {
  try {
    const { code, guestToken, action_type, target_player_id } = await req.json();

    if (!code || !guestToken || !action_type || !target_player_id) {
      return NextResponse.json({ error: 'Missing action fields' }, { status: 400 });
    }

    const result = roomStore.submitNightAction(code, guestToken, {
      action_type,
      target_player_id,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, result: result.result });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
