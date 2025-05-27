// src/store/u1/Writing/SimplifiedSentenceQuiz.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { shuffle } from 'lodash';

// Simplified questions without difficulty levels and translations
const questions = [
  { 
    correct: "She is at home today", 
    words: ["She", "is", "at", "home", "today"],
    category: "daily routines",
    hint: "Subject + verb 'to be' + location + time"
  },
  { 
    correct: "He likes the big dog", 
    words: ["He", "likes", "the", "big", "dog"],
    category: "preferences",
    hint: "Subject + verb + article + adjective + noun"
  },
  { 
    correct: "They play in the park", 
    words: ["They", "play", "in", "the", "park"],
    category: "activities",
    hint: "Subject + verb + preposition + article + location"
  },
  { 
    correct: "I am with my friend", 
    words: ["I", "am", "with", "my", "friend"],
    category: "relationships",
    hint: "Subject + verb 'to be' + preposition + possessive + noun"
  },
  { 
    correct: "We go to school together", 
    words: ["We", "go", "to", "school", "together"],
    category: "education",
    hint: "Subject + verb + preposition + noun + adverb"
  },
  { 
    correct: "The book is on the table", 
    words: ["The", "book", "is", "on", "the", "table"],
    category: "prepositions",
    hint: "Article + subject + verb + preposition + article + location"
  },
  { 
    correct: "My brother has a new car", 
    words: ["My", "brother", "has", "a", "new", "car"],
    category: "possessions",
    hint: "Possessive + subject + verb + article + adjective + object"
  },
  { 
    correct: "She reads books every day", 
    words: ["She", "reads", "books", "every", "day"],
    category: "habits",
    hint: "Subject + verb + object + frequency expression"
  },
  { 
    correct: "I like to eat apples", 
    words: ["I", "like", "to", "eat", "apples"],
    category: "preferences",
    hint: "Subject + verb + infinitive + verb + object"
  },
  { 
    correct: "They watch TV after dinner", 
    words: ["They", "watch", "TV", "after", "dinner"],
    category: "leisure",
    hint: "Subject + verb + object + time expression"
  },
  { 
    correct: "Although it was raining we went to the beach", 
    words: ["Although", "it", "was", "raining", "we", "went", "to", "the", "beach"],
    category: "complex sentences",
    hint: "Subordinating conjunction + clause + main clause"
  },
  { 
    correct: "The students must submit their assignments by Friday", 
    words: ["The", "students", "must", "submit", "their", "assignments", "by", "Friday"],
    category: "obligations",
    hint: "Subject + modal verb + main verb + object + time expression"
  }
];

const SimplifiedSentenceReorderingQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  
  // Initialize question when component mounts or question changes
  useEffect(() => {
    resetQuestion();
  }, [currentQuestion]);

  const resetQuestion = () => {
    setAvailableWords(shuffle([...questions[currentQuestion].words]));
    setSelectedWords([]);
    setFeedback(null);
    setShowHint(false);
  };

  // Handle word selection from available words
  const handleSelectWord = (word: string) => {
    setSelectedWords([...selectedWords, word]);
    setAvailableWords(availableWords.filter(w => w !== word));
  };

  // Handle removing a word from selected words
  const handleRemoveWord = (index: number) => {
    const wordToRemove = selectedWords[index];
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, wordToRemove]);
  };

  const checkAnswer = () => {
    setAttempts(attempts + 1);
    const userSentence = selectedWords.join(' ');
    
    if (userSentence === questions[currentQuestion].correct) {
      setFeedback('Correct! Great job!');
      setScore(score + 1);
      
      setTimeout(() => {
        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setFeedback(`Quiz completed! Your score: ${score + 1}/${questions.length}`);
        }
      }, 1500);
    } else {
      setFeedback('Try again! The word order is not quite right.');
    }
  };

  // Allow skipping to the next question
  const handleSkipQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setFeedback(`Quiz completed! Your score: ${score}/${questions.length}`);
    }
  };

  // Pronunciation feature
  const handlePronounce = () => {
    const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].correct);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-xl shadow-xl flex flex-col items-center">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">Sentence Reordering Quiz</h1>
      <p className="text-gray-700 mb-4">Click words to build your sentence in the correct order.</p>

      <div className="w-full flex justify-end gap-2 mb-4">
        <span className="text-indigo-700 font-medium">Score: {score}/{questions.length}</span>
        <span className="text-gray-500">Attempts: {attempts}</span>
      </div>

      {/* Progress indicator */}
      <div className="w-full mb-4 bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      {/* Category badge */}
      <div className="self-start mb-2">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
          Category: {questions[currentQuestion].category}
        </span>
      </div>
      
      <div className="w-full bg-white p-4 rounded-lg shadow-md mb-4">
        {/* User's sentence construction area */}
        <div className="flex flex-wrap gap-2 min-h-[60px] border-2 border-dashed border-indigo-300 p-4 rounded mb-6 bg-indigo-50">
          {selectedWords.length === 0 ? (
            <span className="text-gray-400 italic">Your sentence will appear here</span>
          ) : (
            selectedWords.map((word, index) => (
              <motion.div
                key={`selected-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-indigo-500 text-white rounded cursor-pointer shadow-sm"
                onClick={() => handleRemoveWord(index)}
              >
                {word}
              </motion.div>
            ))
          )}
        </div>
        
        {/* Available words area */}
        <div className="flex flex-wrap gap-2 p-4 bg-gray-100 rounded min-h-[50px]">
          {availableWords.length === 0 ? (
            <span className="text-gray-400 italic">No more words available</span>
          ) : (
            availableWords.map((word, index) => (
              <motion.div
                key={`available-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded cursor-pointer shadow-sm"
                onClick={() => handleSelectWord(word)}
              >
                {word}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Hint controls */}
      <div className="w-full flex flex-wrap justify-center gap-2 mb-4">
        <button
          onClick={() => setShowHint(!showHint)}
          className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-all text-sm border border-amber-200"
        >
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>
        
        <button
          onClick={handlePronounce}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-sm border border-blue-200"
        >
          <span role="img" aria-label="speaker">🔊</span> Pronounce
        </button>
      </div>

      {/* Hint display area */}
      {showHint && (
        <div className="w-full mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-700">
            <strong>Hint:</strong> {questions[currentQuestion].hint}
          </p>
        </div>
      )}

      {/* Feedback area */}
      {feedback && (
        <div className={`w-full mb-4 p-3 rounded-lg ${
          feedback.includes('Correct') 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-orange-100 text-orange-800 border border-orange-200'
        }`}>
          {feedback}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={checkAnswer}
          disabled={selectedWords.length !== questions[currentQuestion].words.length}
          className={`px-5 py-2 rounded-lg text-white font-medium transition-all ${
            selectedWords.length === questions[currentQuestion].words.length
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Check Answer
        </button>
        
        <button
          onClick={handleSkipQuestion}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-all"
        >
          Skip
        </button>
        
        <button
          onClick={resetQuestion}
          className="px-5 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 font-medium transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SimplifiedSentenceReorderingQuiz;