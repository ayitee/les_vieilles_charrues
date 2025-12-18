import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { getUserId } from '@/lib/cookies';

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const userId = await getUserId();
    const { cardId, answer } = await request.json();

    if (!cardId || !answer) {
      return NextResponse.json({ error: 'Missing cardId or answer' }, { status: 400 });
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // Save or update response
    await prisma.response.upsert({
      where: { userId_cardId: { userId, cardId } },
      update: { answer },
      create: { userId, cardId, answer },
    });

    // Get poll percentages
    const totalResponses = await prisma.response.count({
      where: { cardId },
    });

    const responses = await prisma.response.groupBy({
      by: ['answer'],
      where: { cardId },
      _count: { answer: true },
    });

    const percentages = responses.map((r: { answer: string; _count: { answer: number } }) => ({
      answer: r.answer,
      count: r._count.answer,
      percentage: totalResponses > 0 ? Math.round((r._count.answer / totalResponses) * 100) : 0,
    }));

    return NextResponse.json({ success: true, percentages });
  } catch (error) {
    console.error('Vote endpoint error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to save vote';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
