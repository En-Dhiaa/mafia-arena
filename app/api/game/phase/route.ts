import { NextResponse } from 'next/server';
import { roomStore } from '@/lib/game-engine/room-store';

export async function POST(req: Request) {
  try {
    const { code, guestToken, overrideLeader } = await req.json();

    if (!code || !guestToken) {
      return NextResponse.json({ error: 'Missing code or token' }, { status: 400 });
    }

    const result = roomStore.advancePhase(code, guestToken, overrideLeader);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const snapshot = roomStore.getPublicSnapshot(code);
    return NextResponse.json({
      success: true,
      nextPhase: result.nextPhase,
      snapshot,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

