import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Volume2, RotateCcw } from 'lucide-react';

// Define Flashcard interface
interface Flashcard {
  id: number | string;
  front: string; // Prompt or question (e.g., definition, incomplete sentence)
  back: string;  // Answer or key term (e.g., word, complete sentence)
}

const FIGURE_SPACE = '\u2007';
const SPACES = FIGURE_SPACE.repeat(5);

// Flashcards explaining "have got/has got" vs "have/has" in simple present
const flashcards: Flashcard[] = [
  { 
    id: 1, 
    front: `I${SPACES}a new laptop. (have got)`, 
    back: "I have got a new laptop."
  },
  { 
    id: 2, 
    front: `She${SPACES}two brothers. (to have)`, 
    back: "She has two brothers." 
  },
  { 
    id: 3, 
    front: `${SPACES}you${SPACES}a car? (have got)`, 
    back: "Have you got a car?" 
  },
  { 
    id: 4, 
    front: `${SPACES}he${SPACES}any pets? (to have)`, 
    back: "Does he have any pets?" 
  },
  { 
    id: 5, 
    front: `They${SPACES}a beautiful house. (to have)`, 
    back: "They have a beautiful house." 
  },
  { 
    id: 6, 
    front: `She${SPACES}blue eyes. (have got)`, 
    back: "She has got blue eyes." 
  },
  { 
    id: 7, 
    front: `I${SPACES}enough time to finish this work. (Not to have)`, 
    back: "I don't have enough time to finish this work." 
  },
  { 
    id: 8, 
    front: `We${SPACES}any milk left. (haven't got)`, 
    back: "We haven't got any milk left." 
  },
  { 
    id: 9, 
    front: `${SPACES}she${SPACES}a driving license? (to have)`, 
    back: "Does she have a driving license?" 
  },
  { 
    id: 10, 
    front: `They${SPACES}a swimming pool. (haven't got)`, 
    back: "They haven't got a swimming pool." 
  },
];

const HaveGotFlashcards: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const navigate = useNavigate();

  // Function to play text-to-speech
  const speakText = (text: string) => {
    if (isSpeakingRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    // Try to find a US English voice, otherwise use the first available voice
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

  // Handle card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      // When flipping to back, speak the back content
      speakText(flashcards[currentCard].back);
    }
  };

  // Navigate to previous card
  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  // Navigate to next card
  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  // Replay current audio
  const handleReplayAudio = () => {
    speakText(isFlipped ? flashcards[currentCard].back : flashcards[currentCard].front);
  };

  // Load voices when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Load voices if they're not already loaded
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          // Voices are now loaded
        };
      }
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center">"Have Got" vs "Have" Flashcards</h1>
      
      {/* Card Container */}
      <motion.div
        className="relative w-[460px] h-[288px] mx-auto cursor-pointer"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Front of Card */}
        <div 
          className="absolute w-full h-full bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-2xl font-medium text-indigo-600 text-center">{flashcards[currentCard].front}</p>
        </div>
        
        {/* Back of Card */}
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
      
      {/* Grammar Tip - visible only when card is flipped */}
      {isFlipped && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
          <p className="text-sm text-gray-700">
            {currentCard === 0 || currentCard === 5 || currentCard === 7 || currentCard === 9 ? 
              '"Have got/has got" is more common in British English and expresses possession.' : 
              currentCard === 2 ? 
              'For questions with "have got", we move "have" to the beginning.' :
              currentCard === 3 || currentCard === 8 ? 
              'For questions with "have/has", we use the auxiliary "do/does".' :
              currentCard === 6 ? 
              'For negatives with "have", we use "don\'t/doesn\'t have".' :
              'Both forms are correct, but "have/has" is more common in American English.'}
          </p>
        </div>
      )}
      
      {/* Navigation Controls */}
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
      
      {/* Action Buttons */}
      <div className="flex flex-col items-center mt-6">
        <motion.button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-full flex items-center"
          onClick={handleReplayAudio}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Volume2 className="mr-2" size={18} />
          Replay Audio
        </motion.button>
      </div>
    </div>
  );
};

export default HaveGotFlashcards;