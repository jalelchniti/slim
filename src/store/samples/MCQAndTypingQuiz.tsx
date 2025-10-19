import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface QuizItem {
  type: 'mc' | 'type'; // 'mc' for multiple choice, 'type' for typing
  question: string;
  options?: string[]; // For 'mc' only
  correct: string;
  positive: string; // Positive feedback message
  negative: string; // Negative feedback message
}

// Sample quiz data
const quizData: QuizItem[] = [
  { 
    type: 'mc', 
    question: 'What do you book to fly?', 
    options: ['Flight', 'Hotel', 'Car', 'Ticket'], 
    correct: 'Flight', 
    positive: 'Correct! You need to book a flight to travel by air.', 
    negative: 'Sorry, it\'s Flight. You book a flight when you want to travel by air.' 
  },
  { 
    type: 'type', 
    question: 'Type the word for leaving a place.', 
    correct: 'depart', 
    positive: 'Perfect! To depart means to leave or go away from a place.', 
    negative: 'Sorry, it\'s depart. This word means to leave or go away from a place.' 
  },
  { 
    type: 'mc', 
    question: 'Which word means "a place where you can exchange currency"?', 
    options: ['Bank', 'Store', 'Restaurant', 'Library'], 
    correct: 'Bank', 
    positive: 'Correct! You can exchange currency at a bank.', 
    negative: 'Sorry, it\'s Bank. Banks offer currency exchange services.' 
  },
  { 
    type: 'type', 
    question: 'Type the word for a person who travels to different places.', 
    correct: 'traveler', 
    positive: 'Perfect! A traveler is someone who goes on journeys to various places.', 
    negative: 'Sorry, it\'s traveler. This refers to someone who makes journeys to different places.' 
  },
  { 
    type: 'mc', 
    question: 'What do you need to enter most countries?', 
    options: ['Passport', 'Credit card', 'Laptop', 'Camera'], 
    correct: 'Passport', 
    positive: 'Correct! A passport is an official document issued by a government to its citizens for international travel.', 
    negative: 'Sorry, it\'s Passport. This is the official document you need for international travel.' 
  },
];

const KnowledgeQuiz: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [shuffledQuizData, setShuffledQuizData] = useState<QuizItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [answered, setAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{question: string, userAnswer: string, correct: string, isCorrect: boolean}[]>([]);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  
  // Initialize and shuffle quiz data
  useEffect(() => {
    resetQuiz();
  }, []);
  
  // Shuffle options for current multiple choice question
  useEffect(() => {
    if (shuffledQuizData.length > 0 && currentQuestion < shuffledQuizData.length) {
      const current = shuffledQuizData[currentQuestion];
      if (current.type === 'mc' && current.options) {
        setShuffledOptions([...current.options].sort(() => Math.random() - 0.5));
      }
    }
  }, [currentQuestion, shuffledQuizData]);
  
  // Function to shuffle the quiz data
  const shuffleQuizData = () => {
    return [...quizData].sort(() => Math.random() - 0.5);
  };
  
  // Reset quiz state
  const resetQuiz = () => {
    const shuffled = shuffleQuizData();
    setShuffledQuizData(shuffled);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setTypedAnswer('');
    setAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setQuizCompleted(false);
  };
  
  // Handle multiple choice selection
  const handleOptionSelect = (option: string) => {
    if (answered) return;
    
    setSelectedAnswer(option);
    setAnswered(true);
    
    const currentItem = shuffledQuizData[currentQuestion];
    const isCorrect = option === currentItem.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      speakFeedback(currentItem.positive);
    } else {
      speakFeedback(currentItem.negative);
    }
    
    setUserAnswers(prev => [...prev, {
      question: currentItem.question,
      userAnswer: option,
      correct: currentItem.correct,
      isCorrect
    }]);
  };
  
  // Handle typed answer submission
  const handleTypeSubmit = () => {
    if (answered) return;
    
    setAnswered(true);
    
    const currentItem = shuffledQuizData[currentQuestion];
    const normalizedUserAnswer = typedAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = currentItem.correct.toLowerCase();
    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      speakFeedback(currentItem.positive);
    } else {
      speakFeedback(currentItem.negative);
    }
    
    setUserAnswers(prev => [...prev, {
      question: currentItem.question,
      userAnswer: typedAnswer,
      correct: currentItem.correct,
      isCorrect
    }]);
  };
  
  // Text-to-speech for feedback
  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestion < shuffledQuizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setTypedAnswer('');
      setAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };
  
  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      
      // Restore previous answer
      const prevAnswer = userAnswers[currentQuestion - 1];
      if (prevAnswer) {
        setSelectedAnswer(prevAnswer.userAnswer);
        setTypedAnswer(prevAnswer.userAnswer);
        setAnswered(true);
      }
    }
  };
  
  // Navigate back to flashcards
  const goToFlashcards = () => {
    navigate('/flashcards');
  };
  
  // Progress percentage calculation
  const progressPercentage = ((currentQuestion + 1) / shuffledQuizData.length) * 100;
  
  // Current quiz item
  const currentItem = shuffledQuizData[currentQuestion];
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-white p-6">
      <Card className="p-10 w-full min-w-[600px] max-w-2xl shadow-lg rounded-xl bg-white">
        {!quizCompleted ? (
          <>
            {/* Header and progress */}
            <h2 className="text-3xl font-semibold text-indigo-700 mb-4 text-center">
              {currentItem?.question}
            </h2>
            <div className="w-full mb-6">
              <Progress value={progressPercentage} className="w-full h-2 bg-gray-200" />
              <p className="text-sm text-gray-600 mt-2 text-right">
                Question {currentQuestion + 1} of {shuffledQuizData.length}
              </p>
            </div>
            
            {/* Question area */}
            {currentItem?.type === 'mc' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {shuffledOptions.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full text-lg py-4 rounded-lg ${
                      answered
                        ? option === currentItem.correct
                          ? 'bg-green-500 text-white'
                          : selectedAnswer === option
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    onClick={() => handleOptionSelect(option)}
                    disabled={answered}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}
            
            {currentItem?.type === 'type' && (
              <div className="mb-6">
                <Input
                  type="text"
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full text-lg py-4 mb-4"
                  disabled={answered}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !answered) {
                      handleTypeSubmit();
                    }
                  }}
                />
                <Button
                  onClick={handleTypeSubmit}
                  disabled={answered}
                  className="w-full bg-indigo-600 text-white text-lg hover:bg-indigo-700 py-4"
                >
                  Submit
                </Button>
                
                {answered && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    userAnswers[currentQuestion]?.isCorrect
                      ? 'bg-green-100 border border-green-400 text-green-700'
                      : 'bg-red-100 border border-red-400 text-red-700'
                  }`}>
                    <p className="font-medium">
                      {userAnswers[currentQuestion]?.isCorrect
                        ? currentItem.positive
                        : currentItem.negative}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Navigation controls */}
            <div className="mt-6 flex justify-between items-center">
              <Button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="bg-gray-500 text-white text-lg hover:bg-gray-600 px-6 py-3 rounded-full disabled:bg-gray-300"
              >
                Previous
              </Button>
              
              <Button
                onClick={nextQuestion}
                disabled={!answered}
                className="bg-gray-500 text-white text-lg hover:bg-gray-600 px-6 py-3 rounded-full disabled:bg-gray-300"
              >
                {currentQuestion === shuffledQuizData.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </>
        ) : (
          // Results screen
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold text-indigo-700">Quiz Completed!</h2>
            <p className="text-2xl text-gray-700">
              Your score: {score} / {shuffledQuizData.length} ({Math.round((score / shuffledQuizData.length) * 100)}%)
            </p>
            
            {/* Detailed results */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Review Your Answers</h3>
              {userAnswers.map((answer, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg ${
                    answer.isCorrect
                      ? 'bg-green-100 border border-green-400'
                      : 'bg-red-100 border border-red-400'
                  }`}
                >
                  <p className="font-medium text-left">{answer.question}</p>
                  <div className="flex justify-between mt-2">
                    <p>Your answer: <span className="font-semibold">{answer.userAnswer}</span></p>
                    {!answer.isCorrect && (
                      <p>Correct answer: <span className="font-semibold">{answer.correct}</span></p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action buttons */}
            <div className="grid grid-cols-1 gap-4 mt-8">
              <Button
                onClick={resetQuiz}
                className="w-full bg-red-500 text-white text-lg hover:bg-red-600 py-3 rounded-full"
              >
                Restart Quiz
              </Button>
              
              <Button
                onClick={goToFlashcards}
                className="w-full bg-green-600 text-white text-lg hover:bg-green-700 py-3 rounded-full"
              >
                Back to Flashcards
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default KnowledgeQuiz;
