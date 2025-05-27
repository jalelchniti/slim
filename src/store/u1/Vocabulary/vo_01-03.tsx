import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const flashcards = [
  { word: 'table', image: '/assets/images/table.png' },
  { word: 'chair', image: '/assets/images/chair.png' },
  { word: 'door', image: '/assets/images/door.png' },
  { word: 'window', image: '/assets/images/window.png' },
  { word: 'bed', image: '/assets/images/bed.png' },
  { word: 'desk', image: '/assets/images/desk.png' },
  { word: 'lamp', image: '/assets/images/lamp.png' },
  { word: 'book', image: '/assets/images/book.png' },
];

const FlashcardQuiz: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);
  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };
  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const speakWord = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(flashcards[currentCard].word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('TTS not supported in this browser.');
    }
  };

  // Auto-play TTS when Side B appears
  useEffect(() => {
    if (isFlipped) {
      speakWord();
    }
  }, [isFlipped, currentCard]);

  return (
    <div className="w-full h-[67vh] p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-center">Everyday Objects Flashcards</h1>
      <motion.div
        className="relative w-full flex-1 bg-white rounded-lg shadow-md cursor-pointer overflow-hidden"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Side A: Image Only */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center p-4',
            isFlipped && 'hidden'
          )}
        >
          <img
            src={flashcards[currentCard].image}
            alt={flashcards[currentCard].word}
            className="w-full h-full object-contain"
          />
        </div>
        {/* Side B: Object Name (Counter-Rotated) */}
        <motion.div
          className={cn(
            'absolute inset-0 flex items-center justify-center p-4 bg-blue-100',
            !isFlipped && 'hidden'
          )}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0 }}
        >
          <p className="text-xl font-semibold">{flashcards[currentCard].word}</p>
        </motion.div>
      </motion.div>
      <div className="flex justify-between mt-6 items-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePrev}
          className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300"
        >
          Previous
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={speakWord}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
          aria-label={`Replay pronunciation of ${flashcards[currentCard].word}`}
        >
          Replay Sound
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Next
        </motion.button>
      </div>
      <p className="text-center mt-4 text-gray-600">
        Card {currentCard + 1} of {flashcards.length}
      </p>
    </div>
  );
};

export default FlashcardQuiz;