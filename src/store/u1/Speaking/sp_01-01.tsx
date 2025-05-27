import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, MessageCircle, HelpCircle, Calendar, SmilePlus, LogOut, Book, Globe, Heart } from 'lucide-react';

const IntroductionsFlashcardQuiz = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState<boolean[]>(new Array(10).fill(false));

  const flashcards = [
    { front: 'Say your name.', back: 'Example: "My name is [your name]."', icon: <User className="text-indigo-600" />, category: 'personal' },
    { front: 'Say where you are from.', back: 'Example: "I am from [your country]."', icon: <MapPin className="text-indigo-600" />, category: 'personal' },
    { front: 'Say hello and your name.', back: 'Example: "Hello, my name is [your name]."', icon: <MessageCircle className="text-green-600" />, category: 'greeting' },
    { front: 'Ask someone their name.', back: 'Example: "What is your name?"', icon: <HelpCircle className="text-yellow-600" />, category: 'question' },
    { front: 'Say your age.', back: 'Example: "I am [your age] years old."', icon: <Calendar className="text-indigo-600" />, category: 'personal' },
    { front: 'Ask someone how they are.', back: 'Example: "How are you?"', icon: <SmilePlus className="text-yellow-600" />, category: 'question' },
    { front: 'Say goodbye to someone.', back: 'Example: "Goodbye" or "Bye"', icon: <LogOut className="text-green-600" />, category: 'greeting' },
    { front: 'Say you are a student.', back: 'Example: "I am a student."', icon: <Book className="text-indigo-600" />, category: 'personal' },
    { front: 'Ask where someone is from.', back: 'Example: "Where are you from?"', icon: <Globe className="text-yellow-600" />, category: 'question' },
    { front: 'Say you like learning English.', back: 'Example: "I like learning English."', icon: <Heart className="text-indigo-600" />, category: 'personal' },
  ];

  const markCardAsPracticed = () => {
    const newProgress = [...progress];
    newProgress[currentCard] = true;
    setProgress(newProgress);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => {
      const newFlipped = !prev;
      if (!prev) markCardAsPracticed();
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

  const completedCount = progress.filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / flashcards.length) * 100);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-2 text-center tracking-tight">
        A1 Introductions Flashcard Practice
      </h1>
      <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
        Learn basic English introductions with these simple phrases!
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Your progress</span>
          <span>{completionPercentage}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Category Indicator */}
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
            flashcards[currentCard].category === 'greeting'
              ? 'bg-green-100 text-green-800'
              : flashcards[currentCard].category === 'question'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {flashcards[currentCard].icon && (
            <span className="w-5 h-5">{flashcards[currentCard].icon}</span>
          )}
          {flashcards[currentCard].category === 'greeting'
            ? 'Greeting'
            : flashcards[currentCard].category === 'question'
            ? 'Question'
            : 'Personal Info'}
        </span>
      </div>

      {/* Flashcard */}
      <motion.div
        className="relative w-[460px] h-[288px] mx-auto cursor-pointer mb-4"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.02, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)' }}
        role="button"
        aria-label={`Flashcard ${currentCard + 1}: ${isFlipped ? flashcards[currentCard].back : flashcards[currentCard].front}`}
      >
        {/* Side A: Prompt */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center justify-center p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center gap-4 mb-4">
            {flashcards[currentCard].icon && (
              <span className="w-10 h-10">{flashcards[currentCard].icon}</span>
            )}
          </div>
          <p className="text-4xl font-bold text-indigo-600 tracking-wide text-center">
            {flashcards[currentCard].front}
          </p>
        </motion.div>

        {/* Side B: Example */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl shadow-lg border border-indigo-200 flex flex-col items-center justify-center p-6"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-2xl text-gray-800 text-center font-medium leading-relaxed">
            {flashcards[currentCard].back}
          </p>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-4 max-w-md mx-auto w-full">
        <motion.button
          onClick={handlePrev}
          className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous card"
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
          aria-label="Next card"
        >
          Next
        </motion.button>
      </div>

      <div className="text-gray-600 text-center mt-8 text-lg">
        <p className="italic mb-2">Click the card to flip between the prompt and the example.</p>
        <p className="text-sm">Try to answer before flipping the card?</p>
      </div>
    </div>
  );
};

export default IntroductionsFlashcardQuiz;