import { NextResponse } from 'next/server';
import { roomStore } from '@/lib/game-engine/room-store';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const snapshot = roomStore.getPublicSnapshot(code);

    if (!snapshot) {
      return NextResponse.json(
        { error: 'الغرفة غير موجودة أو انتهت صلاحيتها' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, snapshot });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await req.json();
    const { playerName } = body;

    if (!playerName || typeof playerName !== 'string' || playerName.trim().length === 0) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم اللاعب' },
        { status: 400 }
      );
    }

    const result = roomStore.joinRoom(code, playerName);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      guestToken: result.guestToken,
      playerId: result.playerId,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
  }
}
