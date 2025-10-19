import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface QuizItem {
  type: 'mc' | 'type';
  sentence: string;
  question: string;
  options?: string[];
  correct: string;
  positive: string;
  negative: string;
  hint?: string;
}

interface Flashcard {
  sentence: string;
  question: string;
  answer: string;
  hint?: string;
}

const flashcards: Flashcard[] = [
  { sentence: "I need to book a hotel room.", question: "What do I need to do?", answer: "You need to book a hotel room.", hint: "book a hotel room" },
  { sentence: "Where is the nearest train station?", question: "What am I asking?", answer: "You're asking where the nearest train station is.", hint: "train station" },
  { sentence: "Can I have a map, please?", question: "What do I need?", answer: "You need a map.", hint: "map" },
  { sentence: "How much is a ticket to Paris?", question: "What am I asking?", answer: "You're asking about the price of a ticket to Paris.", hint: "price of a ticket" },
  { sentence: "I'd like to rent a car.", question: "What do I want to do?", answer: "You want to rent a car.", hint: "rent a car" },
  { sentence: "The museum is open until 6 PM.", question: "When does the museum close?", answer: "The museum closes at 6 PM.", hint: "6 PM" },
  { sentence: "I lost my wallet.", question: "What happened?", answer: "You lost your wallet.", hint: "lost my wallet" },
  { sentence: "Where can I exchange currency?", question: "What am I looking for?", answer: "You're looking for a place to exchange currency.", hint: "exchange currency" },
  { sentence: "The tour starts at 9 AM.", question: "When does the tour start?", answer: "It starts at 9 AM.", hint: "9 AM" },
  { sentence: "I need an adapter for my phone.", question: "What do I need?", answer: "You need an adapter for your phone.", hint: "adapter" },
];

const quizData: QuizItem[] = flashcards.map((card) => ({
  type: 'type',
  sentence: card.sentence,
  question: card.question,
  correct: card.answer,
  positive: 'Correct!',
  negative: 'Incorrect.',
  hint: card.hint,
}));

const InteractiveTypeAnswerQuiz: React.FC = () => {
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
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintText, setHintText] = useState<string>('');

  // Initialize and shuffle quiz data
  useEffect(() => {
    resetQuiz();
  }, []);

  // Play the TTS for the current sentence when the question changes
  useEffect(() => {
    if (shuffledQuizData.length > 0 && currentQuestion < shuffledQuizData.length) {
      speakSentence(shuffledQuizData[currentQuestion].sentence);
    }
  }, [currentQuestion, shuffledQuizData]);

  // Shuffle options for current multiple choice question
  useEffect(() => {
    if (shuffledQuizData.length > 0 && currentQuestion < shuffledQuizData.length) {
      const current = shuffledQuizData[currentQuestion];
      if (current.type === 'mc' && current.options) {
        setShuffledOptions([...current.options].sort(() => Math.random() - 0.5));
      }
    }
  }, [currentQuestion, shuffledQuizData]);

  const shuffleQuizData = () => {
    return [...quizData].sort(() => Math.random() - 0.5);
  };

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
    setHintLevel(0);
    setShowHint(false);
    setHintText('');
  };

  const speakSentence = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setAudioPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      
      utterance.onend = () => {
        setAudioPlaying(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }, 500);
    }
  };

  const getHint = () => {
    if (!shuffledQuizData[currentQuestion] || shuffledQuizData[currentQuestion].type !== 'type') return;

    const correctAnswer = shuffledQuizData[currentQuestion].correct;
    setShowHint(true);

    const newHintLevel = Math.min(hintLevel + 1, correctAnswer.length);
    setHintLevel(newHintLevel);

    let hint = '';
    for (let i = 0; i < correctAnswer.length; i++) {
      if (i < newHintLevel) {
        hint += correctAnswer[i];
      } else if (correctAnswer[i] === ' ') {
        hint += ' ';
      } else {
        hint += '_';
      }
    }
    setHintText(hint);

    if (typedAnswer === '') {
      setTypedAnswer(hint.replace(/_/g, ''));
    }
  };

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
      speakFeedback(`${currentItem.negative} The correct answer is: ${currentItem.correct}`);
    }

    setUserAnswers(prev => [...prev, {
      question: currentItem.question,
      userAnswer: option,
      correct: currentItem.correct,
      isCorrect
    }]);
  };

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
      speakFeedback(`${currentItem.negative} The correct answer is: ${currentItem.correct}`);
    }

    setUserAnswers(prev => [...prev, {
      question: currentItem.question,
      userAnswer: typedAnswer,
      correct: currentItem.correct,
      isCorrect
    }]);
  };

  const nextQuestion = () => {
    // If not answered, record it as skipped (empty answer, incorrect)
    if (!answered && currentQuestion < shuffledQuizData.length) {
      const currentItem = shuffledQuizData[currentQuestion];
      setUserAnswers(prev => [...prev, {
        question: currentItem.question,
        userAnswer: '',
        correct: currentItem.correct,
        isCorrect: false
      }]);
    }

    if (currentQuestion < shuffledQuizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setTypedAnswer('');
      setAnswered(false);
      setHintLevel(0);
      setShowHint(false);
      setHintText('');
    } else {
      setQuizCompleted(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      const prevAnswer = userAnswers[currentQuestion - 1];
      if (prevAnswer) {
        setSelectedAnswer(prevAnswer.userAnswer);
        setTypedAnswer(prevAnswer.userAnswer);
        setAnswered(true);
      } else {
        setSelectedAnswer(null);
        setTypedAnswer('');
        setAnswered(false);
      }
      setHintLevel(0);
      setShowHint(false);
      setHintText('');
    }
  };

  const repeatSentence = () => {
    if (shuffledQuizData.length > 0 && currentQuestion < shuffledQuizData.length) {
      speakSentence(shuffledQuizData[currentQuestion].sentence);
    }
  };

  const goToFlashcards = () => {
    navigate('/flashcards');
  };

  const progressPercentage = ((currentQuestion + 1) / shuffledQuizData.length) * 100;
  const currentItem = shuffledQuizData[currentQuestion];

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Card className="p-10 w-full min-w-[600px] max-w-2xl shadow-xl rounded-xl bg-white border-2 border-indigo-200">
        {!quizCompleted ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-indigo-800 text-center flex-grow">
                Listen and Answer
              </h2>
              <motion.button 
                onClick={repeatSentence}
                className={`flex items-center justify-center w-12 h-12 ${audioPlaying ? 'bg-green-500' : 'bg-indigo-600'} text-white p-3 rounded-full hover:bg-indigo-700 shadow-md`}
                title="Listen again"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {audioPlaying ? 
                  <span className="text-xl animate-pulse">🔊</span> : 
                  <span className="text-xl">🔊</span>
                }
              </motion.button>
            </div>
            
            <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200 mb-6">
              <h3 className="text-2xl font-medium text-indigo-900 mb-3 text-center">
                {currentItem?.question}
              </h3>
              
              {currentItem?.hint && (
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-medium text-green-700 text-center">
                    Hint: <span className="text-green-900 font-bold">{currentItem.hint}</span>
                  </p>
                </div>
              )}
            </div>
            
            <div className="w-full mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-indigo-700">Progress</span>
                <span className="text-sm font-medium text-indigo-700">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="w-full h-3 bg-gray-200" />
              <p className="text-sm font-medium text-gray-700 mt-2 text-right">Question {currentQuestion + 1} of {shuffledQuizData.length}</p>
            </div>

            {currentItem?.type === 'mc' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {shuffledOptions.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full text-lg py-4 rounded-lg font-medium shadow-sm border-2 ${
                      answered
                        ? option === currentItem.correct
                          ? 'bg-green-500 text-white border-green-600'
                          : selectedAnswer === option
                            ? 'bg-red-500 text-white border-red-600'
                            : 'bg-gray-100 text-gray-800 border-gray-300'
                          : 'bg-white text-indigo-800 border-indigo-300 hover:bg-indigo-50'
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
                <div className="mb-4">
                  <label htmlFor="answer-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Type your answer:
                  </label>
                  <Input
                    id="answer-input"
                    type="text"
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full text-lg py-6 px-4 rounded-lg border-2 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
                    disabled={answered}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !answered) {
                        handleTypeSubmit();
                      }
                    }}
                  />
                </div>

                {showHint && !answered && (
                  <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="font-medium text-yellow-800">Hint: {hintText}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <motion.button
                    onClick={handleTypeSubmit}
                    disabled={answered}
                    className="flex-1 bg-indigo-600 text-white text-lg hover:bg-indigo-700 py-4 rounded-lg font-bold shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit Answer
                  </motion.button>

                  {!answered && currentItem?.type === 'type' && (
                    <Button
                      onClick={getHint}
                      disabled={hintLevel >= currentItem.correct.length || answered}
                      className="bg-yellow-500 text-white text-lg hover:bg-yellow-600 py-4 px-4 rounded-lg font-bold shadow-md"
                    >
                      Need a Hint
                    </Button>
                  )}
                </div>

                {answered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-5 rounded-lg shadow-md ${
                      userAnswers[currentQuestion]?.isCorrect
                        ? 'bg-green-100 border-l-4 border-green-500 text-green-800'
                        : 'bg-red-100 border-l-4 border-red-500 text-red-800'
                    }`}
                  >
                    <p className="font-bold text-lg mb-1">
                      {userAnswers[currentQuestion]?.isCorrect
                        ? '✓ ' + currentItem.positive
                        : '✗ ' + currentItem.negative}
                    </p>
                    {!userAnswers[currentQuestion]?.isCorrect && (
                      <p className="font-medium">
                        The correct answer is: <span className="underline">{currentItem.correct}</span>
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-between items-center">
              <motion.button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`flex items-center px-6 py-3 rounded-full font-bold shadow-md ${
                  currentQuestion === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-800'
                }`}
                whileHover={currentQuestion !== 0 ? { scale: 1.05 } : {}}
                whileTap={currentQuestion !== 0 ? { scale: 0.95 } : {}}
              >
                ← Previous
              </motion.button>

              <motion.button
                onClick={nextQuestion}
                // Removed disabled={!answered} to allow skipping
                className={`flex items-center px-6 py-3 rounded-full font-bold shadow-md bg-indigo-600 text-white hover:bg-indigo-700`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentQuestion === shuffledQuizData.length - 1 ? 'Finish →' : 'Next →'}
              </motion.button>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold text-indigo-800 mb-2">Quiz Completed!</h2>
              <div className="bg-indigo-100 p-5 rounded-lg mb-8">
                <p className="text-3xl font-bold text-indigo-900">
                  Your score: {score} / {shuffledQuizData.length}
                </p>
                <p className="text-xl font-medium text-indigo-700">
                  ({Math.round((score / shuffledQuizData.length) * 100)}%)
                </p>
              </div>
            </motion.div>

            <div className="mt-8 space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-300 pb-2 mb-4">Review Your Answers</h3>
              {userAnswers.map((answer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-5 rounded-lg shadow-md border-l-4 ${
                    answer.isCorrect
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-bold text-lg text-gray-800">{index + 1}. {answer.question}</p>
                    <motion.button 
                      onClick={() => speakSentence(shuffledQuizData[index].sentence)}
                      className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 text-sm flex items-center justify-center w-8 h-8 shadow-sm"
                      title="Listen to sentence"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      🔊
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Your answer:</p>
                      <p className={`font-medium ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {answer.userAnswer || '(Skipped)'}
                      </p>
                    </div>
                    {!answer.isCorrect && (
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Correct answer:</p>
                        <p className="font-medium text-green-600">{answer.correct}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              <motion.button
                onClick={resetQuiz}
                className="w-full bg-amber-500 text-white text-lg hover:bg-amber-600 py-4 rounded-lg font-bold shadow-md flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>🔄</span>
                <span>Try Again</span>
              </motion.button>

{/* Removed the Back to Flashcards button */}
{/* <motion.button
  onClick={goToFlashcards}
  className="w-full bg-green-600 text-white text-lg hover:bg-green-700 py-4 rounded-lg font-bold shadow-md flex items-center justify-center space-x-2"
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
>
  <span>📚</span>
  <span>Back to Flashcards</span>
</motion.button> */}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InteractiveTypeAnswerQuiz;