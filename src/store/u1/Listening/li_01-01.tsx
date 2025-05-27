import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Define TypeScript interfaces
interface Question {
  text: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

const IntroductionsQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  // Quiz questions
  const questions: Question[] = [
    {
      text: "Hi, my name is Sarah. I'm from Canada and I'm a student.",
      question: "Where is Sarah from?",
      options: ["United States", "Canada", "England", "Australia"],
      correctAnswer: "Canada"
    },
    {
      text: "Hello everyone! I'm David. I work as a software engineer in Tokyo.",
      question: "What does David do?",
      options: ["Teacher", "Doctor", "Software Engineer", "Chef"],
      correctAnswer: "Software Engineer"
    },
    {
      text: "Nice to meet you all. I'm Emma and I've been teaching English for 5 years.",
      question: "How long has Emma been teaching English?",
      options: ["3 years", "4 years", "5 years", "6 years"],
      correctAnswer: "5 years"
    }
    // Add more questions as needed
  ];

  // TTS function with safety checks
  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak the current question's text and clean up
  useEffect(() => {
    if (currentQuestion < questions.length) {
      speakText(questions[currentQuestion].text);
    }
    
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestion]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return; // Prevent multiple answers
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setUserAnswers([...userAnswers, answer]);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setUserAnswers([]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Introductions Listening Quiz</h1>
      {currentQuestion < questions.length ? (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <button
              onClick={() => speakText(questions[currentQuestion].text)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Replay introduction"
            >
              🔊 Replay
            </button>
          </div>

          <p className="text-lg mb-6">{questions[currentQuestion].question}</p>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => {
              const isCorrect = option === questions[currentQuestion].correctAnswer;
              const isSelected = option === selectedAnswer;
              
              return (
                <motion.button
                  key={index}
                  onClick={() => !isAnswered && handleAnswer(option)}
                  className={`w-full p-3 text-left rounded-lg transition-colors ${
                    isAnswered
                      ? isCorrect
                        ? "bg-green-500 text-white"
                        : isSelected
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  disabled={isAnswered}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Quiz Completed! Score: {score}/{questions.length}
          </h2>
          
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  userAnswers[index] === question.correctAnswer
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <p className="font-semibold text-lg">{question.question}</p>
                <p className="mt-2">
                  Your answer: {userAnswers[index]} 
                  {userAnswers[index] === question.correctAnswer ? (
                    <span className="text-green-600 ml-2">✓</span>
                  ) : (
                    <span className="text-red-600 ml-2">✗</span>
                  )}
                </p>
                <p>Correct answer: {question.correctAnswer}</p>
              </div>
            ))}
          </div>
          
          <button
            onClick={resetQuiz}
            className="mt-6 w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Retry Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default IntroductionsQuiz;