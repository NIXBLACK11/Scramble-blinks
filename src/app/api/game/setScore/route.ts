import { NextRequest, NextResponse } from 'next/server';
import { updatePlayerScore } from '@/app/utils/dbFunctions';

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameID = searchParams.get('gameID');
    const playerNumber = parseInt(searchParams.get('playerNumber') || '0', 10);
    const score = parseFloat(searchParams.get('score') || '0');

    if (!gameID || !playerNumber || isNaN(score)) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const updatedGame = await updatePlayerScore(gameID, playerNumber, score);

    return NextResponse.json({ success: true, game: updatedGame });
  } catch {
    return NextResponse.json({ error: 'Internal server error'}, { status: 500 });
  }
}
