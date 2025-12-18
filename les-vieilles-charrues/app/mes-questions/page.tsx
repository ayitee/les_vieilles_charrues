'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Question data: first has text, all others are locked (padlock only)
const questions: Array<{ id: string; text?: string; clickable?: boolean }> = [
  {
    id: 'le-cidre',
    clickable: true,
    text:
      "Le cidre breton devrait-il rester artisanal ou s’industrialiser pour gagner en visibilité internationale ?",
  },
  // create locked placeholders up to 30 total (q-2 .. q-30)
  ...Array.from({ length: 29 }, (_, i) => ({ id: `q-${i + 2}` })),
];

export default function MesQuestions() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = questions.length; // 30

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const current = questions[currentIndex];
  const next1 = questions[(currentIndex + 1) % total];
  const next2 = questions[(currentIndex + 2) % total];

  return (
    <div className="lv-gradient-bg relative w-full min-h-screen overflow-hidden flex flex-col">
      {/* Logo */}
      <div className="flex justify-center pt-6">
        <Image
          src="/images/logo.webp"
          alt="Les Vieilles Charrues"
          width={180}
          height={60}
          priority
          className="w-[40vw] max-w-[240px] h-auto"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-6 text-white">
        {/* Title */}
        <h1 className="font-adhesive text-4xl mb-6 mt-4 text-center">MES QUESTIONS</h1>

        {/* Up arrow */}
        <button onClick={handlePrev} className="mb-4 w-10 h-12 hover:opacity-80 transition">
          <Image src="/images/arrow-left.svg" alt="Up" width={66} height={79} className="w-full h-full rotate-90" />
        </button>

        {/* Current question pill: first clickable with text, others show padlock only */}
        {current.clickable ? (
          <Link href="/card/le-cidre" className="w-full max-w-xs animate-fadeInOut">
            <div className="bg-[#FBB072]/40 text-white rounded-[30px] px-4 py-3 w-full backdrop-blur-sm transition-all duration-300 hover:bg-[#FBB072]/55 hover:shadow-[0_0_20px_rgba(251,176,114,0.35)]">
              <p className="text-sm leading-snug">
                {current.text}
              </p>
            </div>
          </Link>
        ) : (
          <div className="bg-gray-600/30 text-white rounded-[40px] px-4 py-3 w-full max-w-xs backdrop-blur-sm flex items-center justify-center transition-all duration-300 animate-fadeInOut">
            <Image src="/images/padlock.png" alt="Locked" width={20} height={20} className="opacity-80 animate-padlockBounce" />
          </div>
        )}

        {/* Next locked items */}
        {[next1, next2].map((q) => (
          <div key={q.id} className="bg-gray-600/30 text-white rounded-[40px] px-4 py-3 w-full max-w-xs mt-4 backdrop-blur-sm flex items-center justify-center transition-all duration-300 animate-fadeInOut">
            <Image src="/images/padlock.png" alt="Locked" width={20} height={20} className="opacity-70 animate-padlockBounce" />
          </div>
        ))}

        {/* Down arrow */}
        <button onClick={handleNext} className="mt-6 w-10 h-12 hover:opacity-80 transition">
          <Image src="/images/arrow-right.svg" alt="Down" width={66} height={79} className="w-full h-full rotate-90" />
        </button>

        {/* Counter */}
        <div className="font-adhesive text-3xl mt-6">{currentIndex + 1}/{total}</div>

        {/* Helper text */}
        <div className="text-center mt-2 mb-2">
          <p className="font-adhesive text-xl text-white/90">D'autres questions se cachent ...</p>
          <p className="font-adhesive text-xl text-white/90">À vous de les trouver</p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Bottom Section */}
      <div className="w-full flex items-center justify-between px-6 pb-6 gap-3" style={{ paddingBottom: 'calc(9rem + env(safe-area-inset-bottom))' }}>
        <Link href="/mes-questions" className="flex-1 bg-[#FBB072] text-white px-6 py-3 rounded-full text-sm font-bold hover:opacity-90 text-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,176,114,0.4)]">
          MES QUESTIONS
        </Link>
        <Link href="/mes-cartes" className="flex-1 bg-gray-600/30 text-gray-300 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold hover:opacity-80 text-center transition-all duration-300 hover:bg-gray-600/40">
          MES CARTES
        </Link>
      </div>
    </div>
  );
}
