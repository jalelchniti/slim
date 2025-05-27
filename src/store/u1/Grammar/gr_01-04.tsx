import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Flashcard {
  id: number;
  question: string;
  hint: string;
  options: string[];
  correctAnswer: string;
}

const flashcards: Flashcard[] = [
  { id: 1, question: "Is she a teacher?", hint: "👍", options: ["Yes, she is.", "No, she isn’t."], correctAnswer: "Yes, she is." },
  { id: 2, question: "Are they students?", hint: "👎", options: ["Yes, they are.", "No, they aren’t."], correctAnswer: "No, they aren’t." },
  { id: 3, question: "Am I late for class?", hint: "👎", options: ["Yes, you are.", "No, you aren’t."], correctAnswer: "No, you aren’t." },
  { id: 4, question: "Is he from London?", hint: "👍", options: ["Yes, he is.", "No, he isn’t."], correctAnswer: "Yes, he is." },
  { id: 5, question: "Are we at the park?", hint: "👍", options: ["Yes, we are.", "No, we aren’t."], correctAnswer: "Yes, we are." },
  { id: 6, question: "Is it a sunny day?", hint: "👍", options: ["Yes, it is.", "No, it isn’t."], correctAnswer: "Yes, it is." },
  { id: 7, question: "Are you a doctor?", hint: "👎", options: ["Yes, I am.", "No, I’m not."], correctAnswer: "No, I’m not." },
  { id: 8, question: "Is she very tall?", hint: "👍", options: ["Yes, she is.", "No, she isn’t."], correctAnswer: "Yes, she is." },
  { id: 9, question: "Are they from Brazil?", hint: "👎", options: ["Yes, they are.", "No, they aren’t."], correctAnswer: "No, they aren’t." },
  { id: 10, question: "Am I in the right room?", hint: "👍", options: ["Yes, you are.", "No, you aren’t."], correctAnswer: "Yes, you are." },
];

const FlashcardQuiz: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    if (typeof window !== "undefined" && "speechSynthesis" in window && isTtsEnabled) {
      const timer = setTimeout(() => speak(flashcards[0].question), 500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (text: string) => {
    if (!isTtsEnabled || isSpeakingRef.current || !window.speechSynthesis) return;
    isSpeakingRef.current = true;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    const englishVoice = voices.find((voice) => voice.lang === "en-US") || voices[0];
    if (englishVoice) utterance.voice = englishVoice;
    utterance.onend = () => (isSpeakingRef.current = false);
    window.speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    if (newFlipped) speak(flashcards[currentCard].correctAnswer);
  };

  const handleNext = () => {
    setIsFlipped(false);
    const newCard = (currentCard + 1) % flashcards.length;
    setCurrentCard(newCard);
    speak(flashcards[newCard].question);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    const newCard = (currentCard - 1 + flashcards.length) % flashcards.length;
    setCurrentCard(newCard);
    speak(flashcards[newCard].question);
  };

  const handleRepeat = () => {
    if (isFlipped) speak(flashcards[currentCard].correctAnswer);
    else speak(flashcards[currentCard].question);
  };

  const toggleTts = () => {
    setIsTtsEnabled((prev) => !prev);
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center tracking-tight">
        Verb To Be Flashcards
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
        {/* Side A: Question + Hint */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-3xl font-bold text-indigo-600 tracking-wide text-center">
            {flashcards[currentCard].question}
          </p>
          <p className="text-xl text-gray-600 mt-4">Hint: {flashcards[currentCard].hint}</p>
        </motion.div>

        {/* Side B: Correct Answer Only */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl shadow-lg border border-indigo-200 flex items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-2xl font-medium text-gray-800 text-center">
            {flashcards[currentCard].correctAnswer}
          </p>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-10 max-w-md mx-auto w-full">
        <motion.button
          onClick={handlePrev}
          className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300"
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
          className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>
      </div>

      {/* Instructions and TTS Controls */}
      <div className="text-center mt-8">
        <p className="text-gray-600 text-lg italic mb-4">
          Click the card to flip. Hear the question on the front and the answer on the back.
        </p>
        <div className="flex justify-center gap-4">
          <motion.button
            onClick={toggleTts}
            className={`px-4 py-2 rounded-full shadow-md transition-all duration-300 ${
              isTtsEnabled ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isTtsEnabled ? "Turn Off Sound" : "Turn On Sound"}
          </motion.button>
          <motion.button
            onClick={handleRepeat}
            className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300"
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