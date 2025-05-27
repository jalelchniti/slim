import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Question {
  id: number;
  question: string;
  hint: string;
  options: string[];
  correctAnswer: string;
}

const questions: Question[] = [
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

const GrammarQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    setFeedback(isCorrect ? "Correct!" : "Wrong! The correct answer is: " + questions[currentQuestion].correctAnswer);
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        setShowScore(true);
      }
    }, 1500); // Delay for feedback visibility
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="quiz-container p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg"
    >
      {showScore ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="score-section text-center p-6"
        >
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">Quiz Completed!</h2>
          <p className="text-xl text-gray-700 mb-6">
            Your score: <span className="font-semibold text-indigo-600">{score}</span> out of {questions.length}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetQuiz}
            className="px-6 py-3 bg-indigo-500 text-white rounded-full shadow-md hover:bg-indigo-600 transition-colors duration-300"
          >
            Retry Quiz
          </motion.button>
        </motion.div>
      ) : (
        <>
          <div className="question-section mb-8">
            <div className="question-count text-center mb-3">
              <span className="text-lg font-medium text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="question-text text-2xl font-bold text-indigo-700 mb-4 text-center"
            >
              {questions[currentQuestion].question}
            </motion.div>
            <div className="hint-text text-center text-lg text-gray-600 mb-4">
              Hint: {questions[currentQuestion].hint}
            </div>
          </div>
          <div className="answer-section flex justify-center space-x-6 mb-6">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`px-6 py-3 rounded-full shadow-md text-white transition-colors duration-300 ${
                  selectedAnswer === option
                    ? option === questions[currentQuestion].correctAnswer
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center text-lg font-medium ${
                feedback === "Correct!" ? "text-green-600" : "text-red-600"
              }`}
            >
              {feedback}
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default GrammarQuiz;