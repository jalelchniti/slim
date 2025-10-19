import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Flashcard {
  id: number | string;
  front: string;
  back: string;
}

const FIGURE_SPACE = '\u2007';
const SPACES = FIGURE_SPACE.repeat(5);

const flashcards: Flashcard[] = [
  { id: 1, front: `Hello, I'd like to${SPACES}a trip.`, back: "Hello, I'd like to book a trip." },
  { id: 2, front: `Can you${SPACES}me some travel options?`, back: "Can you show me some travel options?" },
  { id: 3, front: `Here's my${SPACES}and boarding pass.`, back: "Here's my passport and boarding pass." },
  { id: 4, front: `Can I have a${SPACES}seat, please?`, back: "Can I have a window seat, please?" },
  { id: 5, front: `Do you have anything to${SPACES}?`, back: "Do you have anything to declare?" },
  { id: 6, front: `This is just for${SPACES}use.`, back: "This is just for personal use." },
  { id: 7, front: `Your flight is now${SPACES}passengers.`, back: "Your flight is now boarding passengers." },
  { id: 8, front: `Please proceed to${SPACES}12.`, back: "Please proceed to gate 12." },
  { id: 9, front: `How long is the${SPACES}to London?`, back: "How long is the flight to London?" },
  { id: 10, front: `May I see your${SPACES}documents?`, back: "May I see your travel documents?" }
];

const VocabularyFlashcards: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const navigate = useNavigate();

  const speakText = (text: string) => {
    if (isSpeakingRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const usVoice = voices.find(voice => voice.lang === 'en-US');
    if (usVoice) {
      utterance.voice = usVoice;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      isSpeakingRef.current = false;
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      // Only speak when flipping to back side
      speakText(flashcards[currentCard].back);
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const handleReplayAudio = () => {
    // Only replay audio for the back side
    if (isFlipped) {
      speakText(flashcards[currentCard].back);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {};
      }
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center">Opening Conversations in Travel Contexts</h1>
      
      <motion.div
        className="relative w-[460px] h-[288px] mx-auto cursor-pointer"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.02 }}
      >
        <div 
          className="absolute w-full h-full bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-2xl font-medium text-indigo-600 text-center">{flashcards[currentCard].front}</p>
        </div>
        
        <div 
          className="absolute w-full h-full bg-indigo-50 rounded-xl shadow-lg border border-indigo-200 flex items-center justify-center p-6"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)'
          }}
        >
          <p className="text-2xl font-medium text-gray-800 text-center">{flashcards[currentCard].back}</p>
        </div>
      </motion.div>
      
      <div className="flex justify-between mt-10 max-w-md mx-auto w-full">
        <motion.button
          className="px-6 py-3 bg-indigo-600 text-white rounded-full flex items-center"
          onClick={handlePrevious}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="mr-1" size={20} />
          Previous
        </motion.button>
        
        <p className="flex items-center text-gray-600">
          Card {currentCard + 1} of {flashcards.length}
        </p>
        
        <motion.button
          className="px-6 py-3 bg-indigo-600 text-white rounded-full flex items-center"
          onClick={handleNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
          <ChevronRight className="ml-1" size={20} />
        </motion.button>
      </div>
      
      <div className="flex flex-col items-center mt-6">
        {isFlipped && (
          <motion.button
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-full flex items-center"
            onClick={handleReplayAudio}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Volume2 className="mr-2" size={18} />
            Replay Answer
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default VocabularyFlashcards;
