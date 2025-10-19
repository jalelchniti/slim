// src/store/Vocabulary/01-01-01.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const flashcards = [
  { sideA: "Hello! How are you?", sideB: "Hi! I'm fine, thank you. And you?" },
  { sideA: "Can you help me, please?", sideB: "Sure! What do you need?" },
  { sideA: "Where is the bathroom?", sideB: "It's down the hall, on your left." },
  { sideA: "I don't understand.", sideB: "Could you repeat that, please?" },
  { sideA: "Excuse me, where is...?", sideB: "Go straight and turn right." },
  { sideA: "How much does this cost?", sideB: "That's five dollars." },
  { sideA: "Thank you very much!", sideB: "You're welcome!" },
  { sideA: "I'm sorry, I'm new here.", sideB: "No problem! Let me help you." },
  { sideA: "Can I have..., please?", sideB: "Of course! Here you go." },
  { sideA: "What time is it?", sideB: "It's three o'clock." },
  { sideA: "See you later!", sideB: "See you! Have a great day!" },
  { sideA: "I need help with...", sideB: "I can help you with that." },
];

const FlashcardQuiz: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true); // TTS toggle state
  const isSpeakingRef = useRef(false); // Ref to prevent duplicate TTS calls

  // Load voices when the component mounts or when voices change
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Function to speak the text, with deduplication and TTS toggle check
  const speak = (text: string) => {
    if (!isTtsEnabled || isSpeakingRef.current) return; // Exit if TTS is off or already speaking
    isSpeakingRef.current = true;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    const englishVoice = voices.find((voice) => voice.lang === "en-US") || voices[0];
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    utterance.onend = () => {
      isSpeakingRef.current = false; // Reset after speech ends
    };
    window.speechSynthesis.speak(utterance);
  };

  // Handle flip with TTS for both sides
  const handleFlip = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);

    // Speak Side A when showing front, Side B when showing back
    if (!newFlipped) {
      speak(flashcards[currentCard].sideA);
    } else {
      speak(flashcards[currentCard].sideB);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    const newCard = (currentCard + 1) % flashcards.length;
    setCurrentCard(newCard);

    // Speak Side A when moving to new card
    speak(flashcards[newCard].sideA);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    const newCard = (currentCard - 1 + flashcards.length) % flashcards.length;
    setCurrentCard(newCard);

    // Speak Side A when moving to new card
    speak(flashcards[newCard].sideA);
  };

  // Repeat the current TTS based on flip state
  const handleRepeat = () => {
    if (!isFlipped) {
      speak(flashcards[currentCard].sideA);
    } else {
      speak(flashcards[currentCard].sideB);
    }
  };

  // Toggle TTS on/off
  const toggleTts = () => {
    setIsTtsEnabled((prev) => !prev);
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech when disabling
      isSpeakingRef.current = false;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4 text-center tracking-tight">
        Session 1: Survival Phrases for USA
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
        Learn essential phrases for daily interactions in America
      </p>

      {/* Flashcard */}
      <motion.div
        className="relative w-[460px] h-[288px] mx-auto cursor-pointer"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
      >
        {/* Side A: Prompt */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-3xl font-bold text-indigo-600 tracking-wide text-center p-6">
            {flashcards[currentCard].sideA}
          </p>
        </motion.div>

        {/* Side B: Response */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl shadow-lg border border-indigo-200 flex items-center justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-2xl text-gray-800 text-center p-6 font-medium leading-relaxed">
            {flashcards[currentCard].sideB}
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

      {/* Instructions and TTS Controls */}
      <div className="text-center mt-8">
        <p className="text-gray-600 text-lg italic mb-4">
          Click the card to flip and hear both the question and the response.
        </p>
        <div className="flex justify-center gap-4">
          <motion.button
            onClick={toggleTts}
            className={`px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg ${
              isTtsEnabled ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isTtsEnabled ? "Deactivate Sound" : "Activate Sound"}
          </motion.button>
          <motion.button
            onClick={handleRepeat}
            className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Repeat Sound
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardQuiz;