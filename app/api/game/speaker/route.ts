import { NextResponse } from 'next/server';
import { roomStore } from '@/lib/game-engine/room-store';

export async function POST(req: Request) {
  try {
    const { code, guestToken } = await req.json();

    if (!code || !guestToken) {
      return NextResponse.json({ error: 'Missing code or token' }, { status: 400 });
    }

    const result = roomStore.passSpeakerTurn(code, guestToken);
    const snapshot = roomStore.getPublicSnapshot(code);

    return NextResponse.json({
      success: result.success,
      nextSpeakerId: result.nextSpeakerId,
      allFinished: result.allFinished,
      snapshot,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

