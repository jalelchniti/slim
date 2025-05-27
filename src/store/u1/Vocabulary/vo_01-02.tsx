// src/store/Vocabulary/01-01-02.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

const IntroductionsQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showCorrect, setShowCorrect] = useState<boolean>(false);

  const dialogue = [
    { speaker: 'Tom', text: '___! I’m Tom.', correct: 'hello' },
    { speaker: 'Jack', text: 'Hi! My ___ is Jack.', correct: 'name' },
    { speaker: 'Tom', text: '___ to meet you, Jack.', correct: 'nice' },
    { speaker: 'Jack', text: 'Nice to meet you too! See you later, ___!', correct: 'bye' },
  ];

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value.toLowerCase().trim();
    setAnswers(newAnswers);
    setFeedback(null);
    setShowCorrect(false);
  };

  const checkAnswers = () => {
    const allCorrect = answers.every((answer, i) => answer === dialogue[i].correct);
    setFeedback(allCorrect ? 'Well done, mates! Perfect score!' : 'Not quite right. Check your answers!');
    setShowCorrect(true);
  };

  const resetQuiz = () => {
    setAnswers(['', '', '', '']);
    setFeedback(null);
    setShowCorrect(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800 drop-shadow-sm">
          Tom & Jack: Introductions Quiz
        </h2>
        
        <div className="space-y-6">
          {dialogue.map((line, index) => (
            <motion.div
              key={index}
              className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4 bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg shadow-sm"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <span className="font-bold text-indigo-700 w-20 shrink-0 drop-shadow-sm">
                {line.speaker}:
              </span>
              <div className="flex-1 flex items-center flex-wrap gap-2">
                <p className="text-gray-800">{line.text.split('___')[0]}</p>
                <input
                  type="text"
                  value={answers[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className={`border p-2 w-32 text-center rounded-lg focus:outline-none focus:ring-2 transition-all shadow-sm
                    ${showCorrect && answers[index] 
                      ? answers[index] === dialogue[index].correct 
                        ? 'border-green-400 bg-green-50 focus:ring-green-400 text-green-700' 
                        : 'border-red-400 bg-red-50 focus:ring-red-400 text-red-700'
                      : 'border-indigo-200 bg-white focus:ring-indigo-400 text-gray-800'
                    }`}
                  placeholder="?"
                />
                <p className="text-gray-800">{line.text.split('___')[1]}</p>
                {showCorrect && answers[index] && answers[index] !== dialogue[index].correct && (
                  <span className="text-sm text-green-600 ml-2 italic">
                    Correct: {dialogue[index].correct}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <motion.button
            onClick={checkAnswers}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Check Answers
          </motion.button>
          <motion.button
            onClick={resetQuiz}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Quiz
          </motion.button>
        </div>

        {feedback && (
          <motion.p
            className={`mt-6 text-center text-lg font-medium ${
              feedback.includes('Well') ? 'text-green-600' : 'text-red-600'
            } bg-white/70 rounded-lg py-2 shadow-sm`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {feedback}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default IntroductionsQuiz;