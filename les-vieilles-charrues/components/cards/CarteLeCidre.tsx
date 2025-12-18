'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EncryptedTitle } from '@/components/EncryptedTitle';

const allCards = [
  { id: 'le-cidre', name: 'LE CIDRE', image: '/images/cidre.webp' },
  { id: 'card-2', name: "L'HERMINE", image: '/images/hermine.webp' },
  { id: 'card-3', name: 'LE TRISKÈLE', image: '/images/triskele.webp' },
  { id: 'card-4', name: 'KORRIGAN', image: '/images/korrigan.webp' },
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `card-${i + 5}`,
    name: `${i + 5}`,
    image: undefined
  }))
];

const answers = [
  'Préserver un modèle entièrement artisanal',
  'Aller vers une production industrielle assumée',
  'Combiner artisanat et industrie',
  'Prioriser le marché local avant l\'international',
  'Autre : ...',
];

export function CarteLeCidre({ cardId = 'le-cidre' }: { cardId?: string }) {
  const router = useRouter();
  const [showPoll, setShowPoll] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Array<{ answer: string; percentage: number }>>([]);
  const [confirming, setConfirming] = useState(false);

  const currentIndex = allCards.findIndex(card => card.id === cardId);
  const currentCard = allCards[currentIndex] || allCards[0];

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      const prevCard = allCards[currentIndex - 1];
      router.push(`/card/${prevCard.id}`);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < allCards.length - 1) {
      const nextCard = allCards[currentIndex + 1];
      router.push(`/card/${nextCard.id}`);
    }
  };

  const handleConfirm = async () => {
    if (!selectedAnswer) return;

    try {
      setConfirming(true);
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: 'le-cidre', answer: selectedAnswer }),
      });

      const data = await response.json();
      console.log('Vote response:', { status: response.status, data });
      if (!response.ok || !Array.isArray(data.percentages)) {
        console.error('Vote error:', { status: response.status, error: data.error, data });
        // Keep poll open and show a friendly error
        return;
      }
      setResults(Array.isArray(data.percentages) ? data.percentages : []);
      setShowResults(true);
      // Scroll to top after showing results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error voting:', error);
      // Keep poll open on error
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div
      className="lv-gradient-bg relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{ paddingTop: 'calc(2rem + env(safe-area-inset-top))' }}
    >
      {/* Overlay when in poll mode */}
      {showPoll && !showResults && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"></div>
      )}

      {/* Logo */}
      <div className="flex justify-center pt-2">
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
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-white relative z-20">
        {/* Title */}
        {!showPoll && (
          <h1 className="font-adhesive text-4xl text-center mt-4 mb-8">
            {currentIndex < 4 ? currentCard.name : <EncryptedTitle />}
          </h1>
        )}

        {!showPoll && (
          <>
            {/* Card with Navigation */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Left Arrow */}
              <button 
                onClick={handlePrevCard}
                disabled={currentIndex === 0}
                className={`flex-shrink-0 w-10 h-12 transition ${
                  currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'
                }`}
              >
                <Image src="/images/arrow-left.svg" alt="Previous" width={66} height={79} className="w-full h-full" />
              </button>

              {/* Cidre Bowl Image */}
              <div className="relative w-48 h-48">
                {currentIndex < 4 ? (
                  currentCard.image ? (
                    <Image
                      src={currentCard.image}
                      alt={currentCard.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold text-white">
                      {currentCard.name}
                    </div>
                  )
                ) : (
                  <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                    <Image src="/images/padlock.png" alt="Locked" width={80} height={80} className="opacity-70" />
                  </div>
                )}
              </div>

              {/* Right Arrow */}
              <button 
                onClick={handleNextCard}
                disabled={currentIndex === allCards.length - 1}
                className={`flex-shrink-0 w-10 h-12 transition ${
                  currentIndex === allCards.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'
                }`}
              >
                <Image src="/images/arrow-right.svg" alt="Next" width={66} height={79} className="w-full h-full" />
              </button>
            </div>
          </>
        )}

        {/* Question */}
        {cardId === 'le-cidre' && !showPoll && (
          <div className="text-center mb-6 max-w-md">
            <h2 className="font-adhesive text-lg mb-2">QUESTION</h2>
            <p className="leading-relaxed text-lg">
              Le cidre breton devrait-il rester artisanal ou s'industrialiser pour gagner en visibilité internationale ?
            </p>
          </div>
        )}

        {/* Locked badge indicator */}
        {cardId !== 'le-cidre' && (
          <div className="text-center mb-6 max-w-md">
            <div className="flex flex-col items-center gap-4">
              <Image src="/images/padlock.png" alt="Locked" width={40} height={40} className="opacity-60" />
              <p className="font-adhesive text-2xl text-white/80">D'autres questions se cachent... à vous de jouer !</p>
            </div>
          </div>
        )}

        {/* Answer Options */}
        {showPoll && !showResults && (
          <div className="w-full flex justify-center px-4 mb-6">
            <div className="space-y-3 w-full max-w-sm">
              {/* SONDAGES button at top */}
              <button
                type="button"
                onClick={() => setShowPoll(false)}
                className="text-center mb-6 flex items-center justify-center gap-3 transition hover:opacity-90 active:opacity-80 w-full"
                aria-label="Fermer les sondages"
              >
                <span className="font-adhesive text-lg">SONDAGES</span>
                <Image src="/images/chevron.svg" alt="Close Poll" width={28} height={18} className="h-5 w-auto -rotate-90" />
              </button>
              {answers.map((answer) => (
                <button
                  key={answer}
                  onClick={() => {
                    setSelectedAnswer(answer);
                    if (answer !== 'Autre : ...') setOtherText('');
                  }}
                  className={`px-5 py-3 rounded-full text-center font-medium transition-all duration-200 shadow-sm ${
                    selectedAnswer === answer
                      ? 'bg-[#FBB072] text-white shadow-[0_0_20px_rgba(251,176,114,0.35)]'
                      : 'bg-black/30 text-white hover:bg-black/45 w-full'
                  } ${selectedAnswer && selectedAnswer !== answer ? 'opacity-50' : ''}`}
                  style={selectedAnswer === answer ? { width: 'fit-content' } : {}}
                >
                  {answer}
                </button>
              ))}
              {selectedAnswer === 'Autre : ...' && (
                <div className="mt-2">
                  <input
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="Votre réponse"
                    className="w-full px-4 py-3 rounded-full bg-black/50 text-white placeholder-white/50 border border-white/15 focus:border-[#FBB072] focus:outline-none transition"
                  />
                </div>
              )}

              {selectedAnswer && (
                <button
                  onClick={handleConfirm}
                  className={`w-full px-8 py-3 bg-[#FBB072] text-white font-bold rounded-full transition-all duration-200 mt-3 ${confirming ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90 shadow-[0_0_18px_rgba(251,176,114,0.35)]'} ${selectedAnswer === 'Autre : ...' && otherText.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={confirming || (selectedAnswer === 'Autre : ...' && otherText.trim() === '')}
                >
                  CONFIRMER
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && Array.isArray(results) && (
          <div className="w-full flex justify-center px-4 mb-6">
            <div className="space-y-3 w-full max-w-sm">
              {(results || []).map((item) => (
                <div key={item.answer} className="relative w-full">
                  <div
                    className="absolute inset-0 rounded-full bg-[#FBB072] opacity-80 transition-all"
                    style={{ width: `${item.percentage}%`, maxWidth: '100%', minWidth: item.percentage > 0 ? '12%' : '0' }}
                  />
                  <div className="relative w-full px-5 py-3 rounded-full bg-black/30 text-white flex items-center justify-between gap-3 shadow-sm">
                    <span className="font-medium text-left leading-snug">{item.answer}</span>
                    <span className="font-bold text-sm whitespace-nowrap">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Polls Section */}
        {!showPoll && cardId === 'le-cidre' && (
          <button
            type="button"
            onClick={() => setShowPoll(true)}
            className="text-center mb-4 flex items-center gap-3 transition hover:opacity-90 active:opacity-80"
            aria-label="Ouvrir les sondages"
          >
            <span className="font-adhesive text-lg">SONDAGES</span>
            <Image src="/images/chevron.svg" alt="Start Poll" width={28} height={18} className="h-5 w-auto rotate-90" />
          </button>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="w-full flex items-center justify-between px-6 pb-6 gap-3 relative z-10" style={{ paddingBottom: 'calc(9rem + env(safe-area-inset-bottom))' }}>
        <Link href="/mes-questions" className="flex-1 bg-gray-600/30 text-gray-300 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold hover:opacity-80 text-center transition-all duration-300 hover:bg-gray-600/40">
          MES QUESTIONS
        </Link>
        <Link href="/mes-cartes" className="flex-1 bg-gray-600/30 text-gray-300 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold hover:opacity-80 text-center transition-all duration-300 hover:bg-gray-600/40">
          MES CARTES
        </Link>
      </div>
    </div>
  );
}
