import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Check, X } from 'lucide-react';

// Define Quiz Item interface
interface QuizItem {
  id: number;
  sentence: string; // Sentence with a blank (_____)
  correctAnswer: string; // The term that fills the blank
  options: string[]; // Multiple choice options
}

// Quiz data based on previous flashcards
const quizItems: QuizItem[] = [
  {
    id: 1,
    sentence: "The act of moving from one place to another is called _____.",
    correctAnswer: "Travel",
    options: ["Travel", "Luggage", "Arrival", "Customs"],
  },
  {
    id: 2,
    sentence: "A detailed plan of a journey is known as an _____.",
    correctAnswer: "Itinerary",
    options: ["Reservation", "Itinerary", "Departure", "Destination"],
  },
  {
    id: 3,
    sentence: "You need a _____ to secure your hotel room in advance.",
    correctAnswer: "Reservation",
    options: ["Boarding Pass", "Travel Insurance", "Reservation", "Luggage"],
  },
  {
    id: 4,
    sentence: "Bags and suitcases for travel are collectively called _____.",
    correctAnswer: "Luggage",
    options: ["Customs", "Luggage", "Departure", "Itinerary"],
  },
  {
    id: 5,
    sentence: "The act of leaving to start a journey is known as _____.",
    correctAnswer: "Departure",
    options: ["Arrival", "Departure", "Travel", "Destination"],
  },
  {
    id: 6,
    sentence: "Reaching your destination is referred to as _____.",
    correctAnswer: "Arrival",
    options: ["Arrival", "Customs", "Reservation", "Travel"],
  },
  {
    id: 7,
    sentence: "The department regulating goods at a border is called _____.",
    correctAnswer: "Customs",
    options: ["Travel Insurance", "Customs", "Boarding Pass", "Itinerary"],
  },
  {
    id: 8,
    sentence: "You need a _____ to board your flight.",
    correctAnswer: "Boarding Pass",
    options: ["Boarding Pass", "Luggage", "Departure", "Reservation"],
  },
  {
    id: 9,
    sentence: "_____ covers costs like trip cancellations and lost luggage.",
    correctAnswer: "Travel Insurance",
    options: ["Destination", "Travel Insurance", "Customs", "Arrival"],
  },
  {
    id: 10,
    sentence: "The place you're traveling to is your _____.",
    correctAnswer: "Destination",
    options: ["Itinerary", "Travel", "Destination", "Departure"],
  },
];

const SimpleMCWithTTS: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const navigate = useNavigate();

  // Function to play text-to-speech
  const speakText = (text: string) => {
    if (isSpeakingRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';

    const voices = window.speechSynthesis.getVoices();
    const usVoice = voices.find(voice => voice.lang === 'en-GB');
    if (usVoice) {
      utterance.voice = usVoice;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      isSpeakingRef.current = false;
    };

    window.speechSynthesis.speak(utterance);
  };

  // Handle answer selection with TTS feedback
  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    setSelectedAnswer(answer);
    const isCorrect = answer === quizItems[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      const feedback = `That's correct. ${quizItems[currentQuestion].sentence.replace('_____', quizItems[currentQuestion].correctAnswer)}`;
      speakText(feedback);
    } else {
      const feedback = `Sorry. That's incorrect. ${quizItems[currentQuestion].sentence.replace('_____', quizItems[currentQuestion].correctAnswer)}`;
      speakText(feedback);
    }
  };

  // Move to next question or show results
  const handleNext = () => {
    if (selectedAnswer === null) return; // Require an answer before proceeding
    if (currentQuestion + 1 < quizItems.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  // Restart quiz
  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  // Load voices when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          // Voices are now loaded
        };
      }
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center">Travel Vocabulary Quiz</h1>

      {showResult ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quiz Completed!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your Score: {score} out of {quizItems.length} ({((score / quizItems.length) * 100).toFixed(0)}%)
          </p>
          <Button
            onClick={handleRestart}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full"
          >
            Restart Quiz
          </Button>
          <Button
            onClick={() => navigate('/vocabulary')}
            className="ml-4 px-6 py-3 bg-green-600 text-white rounded-full"
          >
            Back to Vocabulary
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg"
        >
          <p className="text-xl text-gray-800 mb-6">
            {quizItems[currentQuestion].sentence}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {quizItems[currentQuestion].options.map((option) => (
              <motion.button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`p-4 rounded-lg border ${
                  selectedAnswer === option
                    ? option === quizItems[currentQuestion].correctAnswer
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
                disabled={selectedAnswer !== null}
                whileHover={{ scale: selectedAnswer ? 1 : 1.05 }}
                whileTap={{ scale: selectedAnswer ? 1 : 0.95 }}
              >
                {option}
                {selectedAnswer === option && (
                  option === quizItems[currentQuestion].correctAnswer ? (
                    <Check className="inline ml-2 text-green-600" size={20} />
                  ) : (
                    <X className="inline ml-2 text-red-600" size={20} />
                  )
                )}
              </motion.button>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Question {currentQuestion + 1} of {quizItems.length}
            </p>
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full"
            >
              {currentQuestion + 1 === quizItems.length ? 'Finish' : 'Next'}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SimpleMCWithTTS;
