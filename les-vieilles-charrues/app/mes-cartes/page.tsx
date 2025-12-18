'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Badge {
  cardId: string;
  userAnswer: string;
  percentages: Array<{ answer: string; count: number; percentage: number }>;
}

const baseCards = [
  { id: 'le-cidre', name: 'LE CIDRE', earned: true, image: '/images/cidre.webp', clickable: true },
  { id: 'card-2', name: "L'HERMINE", earned: true, image: '/images/hermine.webp', clickable: false },
  { id: 'card-3', name: 'LE TRISKÈLE', earned: true, image: '/images/triskele.webp', clickable: false },
  { id: 'card-4', name: 'KORRIGAN', earned: true, image: '/images/korrigan.webp', clickable: false },
];

const placeholderCards = Array.from({ length: 26 }, (_, idx) => {
  const num = idx + 5; // start numbering at 5
  return { id: `card-${num}`, name: `${num}`, earned: false as const, image: undefined as unknown as string, clickable: false };
});

const allCards = [...baseCards, ...placeholderCards];

export default function MesCartes() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        setBadges(data.badges || []);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const pageSize = 4;
  const totalPages = Math.ceil(allCards.length / pageSize);

  const handleNext = () => {
    setPageIndex((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setPageIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const start = pageIndex * pageSize;
  const end = Math.min(start + pageSize, allCards.length);
  const visibleCards = allCards.slice(start, end).map((card, idx) => ({ ...card, idx: start + idx }));

  return (
    <div className="lv-gradient-bg relative w-full min-h-screen overflow-hidden flex flex-col">
      {/* Logo */}
      <div className="flex justify-center pt-6">
        <Image
          src="/images/Logo.webp"
          alt="Les Vieilles Charrues"
          width={180}
          height={60}
          priority
          className="w-[40vw] max-w-[240px] h-auto"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 text-white">
        {/* Title */}
        <h1 className="font-adhesive text-4xl mb-8 mt-4 text-center">MES CARTES</h1>

        {!loading && (
          <>
            {/* Cards Grid with Navigation */}
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Left Arrow */}
              <button onClick={handlePrev} className="flex-shrink-0 w-10 h-12 hover:opacity-80 transition">
                <Image src="/images/arrow-left.svg" alt="Previous" width={66} height={79} className="w-full h-full" />
              </button>

              {/* Cards */}
              <div className="grid grid-cols-2 gap-4">
                {visibleCards.map((card) => (
                  card.clickable ? (
                    <Link
                      key={card.id}
                      href={`/card/${card.id}`}
                      className="rounded-lg p-4 text-center w-32 h-40 flex flex-col items-center justify-center cursor-pointer transform bg-[#FBB072]/40 text-white shadow-sm backdrop-blur-sm hover:scale-110 hover:bg-[#FBB072]/55 hover:shadow-[0_0_20px_rgba(251,176,114,0.35)] hover:transition-all hover:duration-300"
                    >
                      <div className="text-[10px] uppercase tracking-wide opacity-80 mb-1">#{card.idx + 1}</div>
                      {card.image ? (
                        <div className="relative w-20 h-20 mb-2">
                          <Image
                            src={card.image}
                            alt={card.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 mb-2 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold text-white">
                          {card.name}
                        </div>
                      )}
                      <h3 className="font-bold text-xs text-center">{card.name}</h3>
                    </Link>
                  ) : card.earned ? (
                    <div
                      key={card.id}
                      className="rounded-lg p-4 text-center w-32 h-40 flex flex-col items-center justify-center bg-gray-600/30 text-gray-300 backdrop-blur-sm cursor-not-allowed hover:bg-gray-600/40"
                    >
                      <div className="text-[10px] uppercase tracking-wide opacity-80 mb-1">#{card.idx + 1}</div>
                      {card.image ? (
                        <div className="relative w-20 h-20 mb-2">
                          <Image
                            src={card.image}
                            alt={card.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 mb-2 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold text-white">
                          {card.name}
                        </div>
                      )}
                      <h3 className="font-bold text-xs text-center">{card.name}</h3>
                    </div>
                  ) : (
                    <div
                      key={card.id}
                      className="rounded-lg p-4 text-center w-32 h-40 flex flex-col items-center justify-center bg-gray-600/30 text-gray-300 backdrop-blur-sm cursor-not-allowed hover:bg-gray-600/40"
                    >
                      <div className="text-[10px] uppercase tracking-wide opacity-80 mb-1">#{card.idx + 1}</div>
                      <div className="flex-1 flex items-center justify-center">
                        <Image src="/images/padlock.png" alt="Locked" width={32} height={32} className="opacity-70" />
                      </div>
                    </div>
                  )
                ))}
              </div>


              {/* Right Arrow */}
              <button onClick={handleNext} className="flex-shrink-0 w-10 h-12 hover:opacity-80 transition">
                <Image src="/images/arrow-right.svg" alt="Next" width={66} height={79} className="w-full h-full" />
              </button>
            </div>

            {/* Counter */}
            <div className="font-adhesive text-3xl mt-2 mb-2">1/30</div>
          </>
        )}

        {loading && <div className="text-white">Chargement...</div>}
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Bottom Section */}
      <div className="w-full flex items-center justify-between px-6 pb-6 gap-3" style={{ paddingBottom: 'calc(9rem + env(safe-area-inset-bottom))' }}>
        <Link href="/mes-questions" className="flex-1 bg-gray-600/30 text-gray-300 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold hover:opacity-80 text-center transition-all duration-300 hover:bg-gray-600/40">
          MES QUESTIONS
        </Link>
        <Link href="/mes-cartes" className="flex-1 bg-[#FBB072] text-white px-6 py-3 rounded-full text-sm font-bold hover:opacity-90 text-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,176,114,0.4)]">
          MES CARTES
        </Link>
      </div>
    </div>
  );
}
