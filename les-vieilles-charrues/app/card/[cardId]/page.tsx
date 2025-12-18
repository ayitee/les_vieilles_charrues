'use client';

import { use } from 'react';
import Link from 'next/link';
import { CarteLeCidre } from '@/components/cards/CarteLeCidre';

export default function CardPage({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = use(params);

  // Accept all card IDs (le-cidre, card-2, card-3, etc.)
  return <CarteLeCidre cardId={cardId} />;
}

