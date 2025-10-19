import React, { useState, useEffect, FC } from 'react';
import { 
  Plane, 
  Map, 
  Compass, 
  Camera, 
  Briefcase, 
  Globe, 
  Car, 
  Hotel,
  Book,       // For Guidebook
  Tag,        // For Ticket
  FileText,   // For Passport
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Award, 
  Check, 
  X, 
  HelpCircle 
} from 'lucide-react';

// Define interfaces for the data structures
interface TravelItem {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
}

interface CurrentQuestion {
  type: string;
  item: TravelItem;
  correctAnswerId: string;
}

interface Feedback {
  correct: boolean;
  message: string;
}

interface GameMode {
  id: string;
  name: string;
  description: string;
}

const TravelGame: FC = () => {
  const travelItems: TravelItem[] = [
    { id: 'plane', name: 'Plane', icon: <Plane size={64} />, description: 'A vehicle that flies for long-distance travel.' },
    { id: 'car', name: 'Car', icon: <Car size={64} />, description: 'A road vehicle for personal transport.' },
    { id: 'ticket', name: 'Ticket', icon: <Tag size={64} />, description: 'A pass for using transport or entering a place.' },
    { id: 'map', name: 'Map', icon: <Map size={64} />, description: 'A diagram showing geographic locations.' },
    { id: 'compass', name: 'Compass', icon: <Compass size={64} />, description: 'A tool for finding direction.' },
    { id: 'globe', name: 'Globe', icon: <Globe size={64} />, description: 'A spherical model of Earth for planning routes.' },
    { id: 'guidebook', name: 'Guidebook', icon: <Book size={64} className="text-blue-600" />, description: 'A book with travel information.' },
    { id: 'suitcase', name: 'Suitcase', icon: <Briefcase size={64} />, description: 'A bag for carrying clothes and items.' },
    { id: 'camera', name: 'Camera', icon: <Camera size={64} />, description: 'A device for capturing travel memories.' },
    { id: 'passport', name: 'Passport', icon: <FileText size={64} className="text-red-600" />, description: 'A document for international travel.' },
    { id: 'hotel', name: 'Hotel', icon: <Hotel size={64} />, description: 'A place to stay during travel.' }
  ];

  // Game states
  const [gameMode, setGameMode] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion | null>(null);
  const [options, setOptions] = useState<TravelItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [memoryCards, setMemoryCards] = useState<TravelItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  // Game modes
  const gameModes: GameMode[] = [
    { id: 'identification', name: 'Travel Item Identification', description: 'Identify travel items from their descriptions' },
    { id: 'matching', name: 'Travel Item Matching', description: 'Match travel items with their correct names' },
    { id: 'memory', name: 'Travel Memory', description: 'Match pairs of travel items in a memory game' }
  ];

  // Initialize identification game
  const startIdentificationGame = () => {
    setGameMode('identification');
    setScore(0);
    setQuestionsAnswered(0);
    setGameOver(false);
    nextIdentificationQuestion();
  };

  // Generate next identification question
  const nextIdentificationQuestion = () => {
    if (questionsAnswered >= 10) {
      endGame();
      return;
    }

    const randomItemIndex = Math.floor(Math.random() * travelItems.length);
    const correctItem = travelItems[randomItemIndex];
    
    let incorrectOptions: TravelItem[] = [];
    const usedIndices = new Set([randomItemIndex]);
    
    while (incorrectOptions.length < 3) {
      const idx = Math.floor(Math.random() * travelItems.length);
      if (!usedIndices.has(idx)) {
        incorrectOptions.push(travelItems[idx]);
        usedIndices.add(idx);
      }
    }
    
    const allOptions = [correctItem, ...incorrectOptions];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    setCurrentQuestion({
      type: 'identification',
      item: correctItem,
      correctAnswerId: correctItem.id
    });
    
    setOptions(allOptions);
    setSelectedOption(null);
    setFeedback(null);
  };

  // Initialize matching game
  const startMatchingGame = () => {
    setGameMode('matching');
    setScore(0);
    setQuestionsAnswered(0);
    setGameOver(false);
    nextMatchingQuestion();
  };

  // Generate next matching question
  const nextMatchingQuestion = () => {
    if (questionsAnswered >= 10) {
      endGame();
      return;
    }

    const randomItemIndex = Math.floor(Math.random() * travelItems.length);
    const correctItem = travelItems[randomItemIndex];
    
    let incorrectOptions: Partial<TravelItem>[] = [];
    const usedIndices = new Set([randomItemIndex]);
    
    while (incorrectOptions.length < 3) {
      const idx = Math.floor(Math.random() * travelItems.length);
      if (!usedIndices.has(idx)) {
        incorrectOptions.push({
          id: travelItems[idx].id,
          description: travelItems[idx].description
        });
        usedIndices.add(idx);
      }
    }
    
    const allOptions: any = [
      { id: correctItem.id, description: correctItem.description },
      ...incorrectOptions
    ];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    setCurrentQuestion({
      type: 'matching',
      item: correctItem,
      correctAnswerId: correctItem.id
    });
    
    setOptions(allOptions);
    setSelectedOption(null);
    setFeedback(null);
  };

  // Initialize memory game
  const startMemoryGame = () => {
    setGameMode('memory');
    setScore(0);
    setMoves(0);
    setGameOver(false);
    setFlippedCards([]);
    setMatchedCards([]);
    
    const shuffledItems = [...travelItems].sort(() => 0.5 - Math.random()).slice(0, 8);
    
    const pairs = shuffledItems.flatMap(item => [
      { ...item, id: `${item.id}-1` },
      { ...item, id: `${item.id}-2` }
    ]);
    
    const shuffledPairs = [...pairs].sort(() => 0.5 - Math.random());
    
    setMemoryCards(shuffledPairs);
  };

  // Handle card flip in memory game
  const handleCardFlip = (cardId: string) => {
    if (matchedCards.includes(cardId) || flippedCards.includes(cardId) || flippedCards.length >= 2) {
      return;
    }
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCardBaseId = firstCardId.split('-')[0];
      const secondCardBaseId = secondCardId.split('-')[0];
      
      if (firstCardBaseId === secondCardBaseId) {
        setMatchedCards([...matchedCards, firstCardId, secondCardId]);
        setFlippedCards([]);
        setScore(score + 10);
        
        if (matchedCards.length + 2 === memoryCards.length) {
          setTimeout(() => {
            endGame();
          }, 1000);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Answer verification
  const verifyAnswer = (selectedId: string) => {
    setSelectedOption(selectedId);
    
    if (!currentQuestion) return;

    const isCorrect = selectedId === currentQuestion.correctAnswerId;
    
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? 'Correct!' : 'Incorrect!'
    });
    
    if (isCorrect) {
      setScore(score + 10);
    }
    
    setQuestionsAnswered(questionsAnswered + 1);
    
    setTimeout(() => {
      if (gameMode === 'identification') {
        nextIdentificationQuestion();
      } else if (gameMode === 'matching') {
        nextMatchingQuestion();
      }
    }, 1500);
  };

  // End game
  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  // Reset game
  const resetGame = () => {
    setGameMode('menu');
    setScore(0);
    setQuestionsAnswered(0);
    setGameOver(false);
    setSelectedOption(null);
    setFeedback(null);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Travel Items Game</h1>
        
        {/* Game Menu */}
        {gameMode === 'menu' && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-6">Select a Game Mode</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {gameModes.map((mode) => (
                <div 
                  key={mode.id}
                  className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center"
                  onClick={() => {
                    if (mode.id === 'identification') startIdentificationGame();
                    else if (mode.id === 'matching') startMatchingGame();
                    else if (mode.id === 'memory') startMemoryGame();
                  }}
                >
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">{mode.name}</h3>
                  <p className="text-gray-600 text-center">{mode.description}</p>
                </div>
              ))}
            </div>
            {highScore > 0 && (
              <div className="mt-8 text-center">
                <p className="text-lg">High Score: <span className="font-bold text-blue-600">{highScore}</span></p>
              </div>
            )}
          </div>
        )}
        
        {/* Travel Item Identification Game */}
        {gameMode === 'identification' && !gameOver && currentQuestion && (
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-6">
              <button onClick={resetGame} className="flex items-center text-blue-700">
                <ArrowLeft size={20} className="mr-1" /> Back to Menu
              </button>
              <div className="text-lg font-semibold">
                Score: <span className="text-blue-600">{score}</span> | Question: {questionsAnswered + 1}/10
              </div>
            </div>
            
            <div className="w-full bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">What travel item matches this description?</h2>
              <p className="text-lg italic mb-6 text-gray-700">"{currentQuestion.item.description}"</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.map((option) => (
                  <button
                    key={option.id}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      selectedOption === option.id
                        ? selectedOption === currentQuestion.correctAnswerId
                          ? 'bg-green-100 border-green-500'
                          : 'bg-red-100 border-red-500'
                        : 'bg-white border-gray-300 hover:border-blue-500'
                    }`}
                    onClick={() => !selectedOption && verifyAnswer(option.id)}
                    disabled={selectedOption !== null}
                  >
                    <div className="mb-2">{option.icon}</div>
                    <span className="text-center font-medium">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {feedback && (
              <div className={`w-full p-4 rounded-lg mb-4 text-center ${
                feedback.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <p className="text-lg font-semibold">{feedback.message}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Travel Item Matching Game */}
        {gameMode === 'matching' && !gameOver && currentQuestion && (
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-6">
              <button onClick={resetGame} className="flex items-center text-blue-700">
                <ArrowLeft size={20} className="mr-1" /> Back to Menu
              </button>
              <div className="text-lg font-semibold">
                Score: <span className="text-blue-600">{score}</span> | Question: {questionsAnswered + 1}/10
              </div>
            </div>
            
            <div className="w-full bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-semibold mb-4">Match the correct description for:</h2>
                  <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
                    <div className="flex flex-col items-center">
                      <div className="mb-2">{currentQuestion.item.icon}</div>
                      <span className="text-lg font-medium">{currentQuestion.item.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {options.map((option) => (
                  <button
                    key={option.id}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedOption === option.id
                        ? option.id === currentQuestion.correctAnswerId
                          ? 'bg-green-100 border-green-500'
                          : 'bg-red-100 border-red-500'
                        : 'bg-white border-gray-300 hover:border-blue-500'
                    }`}
                    onClick={() => !selectedOption && verifyAnswer(option.id)}
                    disabled={selectedOption !== null}
                  >
                    <p className="text-gray-700">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {feedback && (
              <div className={`w-full p-4 rounded-lg mb-4 text-center ${
                feedback.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <p className="text-lg font-semibold">{feedback.message}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Memory Game */}
        {gameMode === 'memory' && !gameOver && (
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-6">
              <button onClick={resetGame} className="flex items-center text-blue-700">
                <ArrowLeft size={20} className="mr-1" /> Back to Menu
              </button>
              <div className="text-lg font-semibold">
                Score: <span className="text-blue-600">{score}</span> | Moves: {moves}
              </div>
            </div>
            
            <div className="w-full bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Match the pairs of travel items</h2>
              
              <div className="grid grid-cols-4 gap-4">
                {memoryCards.map((card) => {
                  const isFlipped = flippedCards.includes(card.id) || matchedCards.includes(card.id);
                  const baseId = card.id.split('-')[0];
                  const matchedItem = travelItems.find(t => t.id === baseId);
                  
                  return (
                    <div
                      key={card.id}
                      className={`aspect-square cursor-pointer transition-all duration-300 transform ${
                        isFlipped ? 'rotate-y-180' : ''
                      }`}
                      onClick={() => handleCardFlip(card.id)}
                    >
                      <div className="relative w-full h-full">
                        {/* Card Back */}
                        <div className={`absolute w-full h-full flex items-center justify-center bg-blue-600 rounded-lg shadow-md transition-opacity duration-300 ${
                          isFlipped ? 'opacity-0' : 'opacity-100'
                        }`}>
                          <HelpCircle size={48} className="text-white" />
                        </div>
                        
                        {/* Card Front */}
                        <div className={`absolute w-full h-full bg-white rounded-lg border-2 ${
                          matchedCards.includes(card.id) ? 'border-green-500' : 'border-blue-300'
                        } flex flex-col items-center justify-center p-2 transition-opacity duration-300 ${
                          isFlipped ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <div>{matchedItem?.icon}</div>
                          <span className="text-center text-sm font-medium mt-2">{matchedItem?.name}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Game Over Screen */}
        {gameOver && (
          <div className="flex flex-col items-center">
            <div className="bg-blue-50 rounded-lg p-6 mb-6 w-full max-w-md text-center">
              <Award size={64} className="mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
              <p className="text-lg mb-4">Your Score: <span className="font-bold text-blue-600">{score}</span></p>
              {gameMode === 'memory' && (
                <p className="text-lg mb-4">Total Moves: <span className="font-bold">{moves}</span></p>
              )}
              {score > highScore - score && (
                <p className="text-lg mb-4 text-green-600 font-semibold">New High Score!</p>
              )}
              
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => {
                    if (gameMode === 'identification') startIdentificationGame();
                    else if (gameMode === 'matching') startMatchingGame();
                    else if (gameMode === 'memory') startMemoryGame();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <RefreshCw size={20} className="mr-2" /> Play Again
                </button>
                <button
                  onClick={resetGame}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center"
                >
                  <ArrowLeft size={20} className="mr-2" /> Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelGame;