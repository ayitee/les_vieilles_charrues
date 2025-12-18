import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { getUserId } from '@/lib/cookies';

export async function GET(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const userId = await getUserId();

    // Get user's responses
    const responses = await prisma.response.findMany({
      where: { userId },
    });

    // Get poll data for each card
    const cardsData = await Promise.all(
      responses.map(async (response) => {
        const totalResponses = await prisma.response.count({
          where: { cardId: response.cardId },
        });

        const pollResponses = await prisma.response.groupBy({
          by: ['answer'],
          where: { cardId: response.cardId },
          _count: { answer: true },
        });

        const percentages = pollResponses.map((r) => ({
          answer: r.answer,
          count: r._count.answer,
          percentage: totalResponses > 0 ? Math.round((r._count.answer / totalResponses) * 100) : 0,
        }));

        return {
          cardId: response.cardId,
          userAnswer: response.answer,
          percentages,
        };
      })
    );

    return NextResponse.json({ badges: cardsData });
  } catch (error) {
    console.error('Progress endpoint error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to fetch progress';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
