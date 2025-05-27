import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const flashcards = [
  {
    incomplete: "I _____ a student.",
    complete: "I'm a student.",
  },
  {
    incomplete: "She _____ a teacher.",
    complete: "She's a teacher.",
  },
  {
    incomplete: "They _____ at school.",
    complete: "They're at school.",
  },
  {
    incomplete: "We _____ happy.",
    complete: "We're happy.",
  },
  {
    incomplete: "He _____ my friend.",
    complete: "He's my friend.",
  },
  {
    incomplete: "You _____ amazing!",
    complete: "You're amazing!",
  },
  {
    incomplete: "It _____ a cat.",
    complete: "It's a cat.",
  },
  {
    incomplete: "I _____ not tired.",
    complete: "I'm not tired.",
  },
  {
    incomplete: "She _____ not here.",
    complete: "She's not here.",
  },
  {
    incomplete: "They _____ not ready.",
    complete: "They're not ready.",
  },
];

const SimplePresentVerbToBeFlashcards: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSoundActive, setIsSoundActive] = useState<boolean>(true);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Speak the complete sentence using TTS
  const speak = (text: string) => {
    if (!isSoundActive) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB'; // British English
    const britishFemaleVoice = voices.find(
      (voice) => voice.lang === 'en-GB' && voice.name.includes('Female')
    );

    if (britishFemaleVoice) {
      utterance.voice = britishFemaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => {
      const newFlipped = !prev;
      if (newFlipped) {
        speak(flashcards[currentCard].complete); // Speak the complete sentence when flipped to Side B
      }
      return newFlipped;
    });
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const toggleSound = () => setIsSoundActive((prev) => !prev);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center">
        Simple Present of the Verb "To Be" Flashcards
      </h1>

      {/* Flashcard */}
      <motion.div
        className="relative w-[460px] h-[288px] mx-auto cursor-pointer"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
      >
        {/* Side A: Incomplete Sentence */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-2xl font-semibold text-indigo-600 text-center p-6">
            {flashcards[currentCard].incomplete}
          </p>
        </motion.div>

        {/* Side B: Complete Sentence */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl shadow-lg border border-indigo-200 flex items-center justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-2xl text-gray-800 text-center p-6 font-medium leading-relaxed">
            {flashcards[currentCard].complete}
          </p>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-10 max-w-md mx-auto w-full">
        <motion.button
          onClick={handlePrev}
          className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Previous
        </motion.button>
        <p className="text-xl text-gray-600 font-semibold flex items-center">
          Card {currentCard + 1} of {flashcards.length}
        </p>
        <motion.button
          onClick={handleNext}
          className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>
      </div>

      {/* Sound Toggle */}
      <motion.button
        onClick={toggleSound}
        className={`mt-6 px-6 py-2 rounded-full ${
          isSoundActive ? 'bg-green-500' : 'bg-red-500'
        } text-white hover:${
          isSoundActive ? 'bg-green-600' : 'bg-red-600'
        } transition-all duration-300`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isSoundActive ? 'Deactivate Sound' : 'Activate Sound'}
      </motion.button>

      <p className="text-gray-600 text-center mt-8 text-lg italic">
        Click the card to flip between the incomplete and complete sentences.
      </p>
    </div>
  );
};

export default SimplePresentVerbToBeFlashcards;