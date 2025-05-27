// src/store/u1/Reading/01-03-02.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const quizData = {
  text: "My name is Anna. I live in a small house. It has two bedrooms and a kitchen. Every day, I walk to the park. The park is big and green. I like to read books there. Sometimes, my friend Tom comes with me. We talk about our day.",
  questions: [
    {
      question: "Where does Anna live?",
      options: ["In a big house", "In a small house", "In an apartment", "In a school"],
      correctAnswer: "In a small house",
    },
    {
      question: "How many bedrooms does Anna’s house have?",
      options: ["One", "Two", "Three", "Four"],
      correctAnswer: "Two",
    },
    {
      question: "What does Anna do every day?",
      options: ["She reads books", "She walks to the park", "She cooks food", "She visits Tom"],
      correctAnswer: "She walks to the park",
    },
    {
      question: "What does Anna like to do in the park?",
      options: ["Play games", "Read books", "Eat lunch", "Run fast"],
      correctAnswer: "Read books",
    },
    {
      question: "Who sometimes goes to the park with Anna?",
      options: ["Her mother", "Her teacher", "Her friend Tom", "Her dog"],
      correctAnswer: "Her friend Tom",
    },
  ],
};

const ReadingQuiz02: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === quizData.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestion < quizData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }, 1500); // 1.5s delay before moving to next question
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      {!showResults ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Read the Text</h2>
            <p className="text-gray-700">{quizData.text}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-indigo-600">
              {quizData.questions[currentQuestion].question}
            </h3>
            <div className="grid gap-4 mt-4">
              {quizData.questions[currentQuestion].options.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`p-3 rounded-lg border ${
                    selectedAnswer === option
                      ? option === quizData.questions[currentQuestion].correctAnswer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                  whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Results</h2>
          <p className="text-xl">
            Your Score: {score} / {quizData.questions.length}
          </p>
          <motion.button
            onClick={resetQuiz}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Try Again
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default ReadingQuiz02;