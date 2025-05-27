import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  feedback: string;
}

const quizData: QuizQuestion[] = [
    {
      id: 1,
      text: "What is Anna's job?",
      options: ["She is a nurse.", "She is a builder.", "She is an office worker.", "She is a teacher."],
      correctAnswer: "She is a nurse.",
      category: "Jobs",
      feedback: "The text says Anna is a nurse. The other options are not mentioned for her."
    },
    {
      id: 2,
      text: "Is Tom married?",
      options: ["Yes, he is.", "No, he isn’t.", "Yes, she is.", "No, they are."],
      correctAnswer: "Yes, he is.",
      category: "Personal Information",
      feedback: "The text says Tom is married, and 'he' refers to a man."
    },
    {
      id: 3,
      text: "Where does Anna live?",
      options: ["It’s 12 Park Street.", "It’s Scotland.", "It’s an office.", "It’s England."],
      correctAnswer: "It’s 12 Park Street.",
      category: "Personal Information",
      feedback: "The text says Anna lives at 12 Park Street."
    },
    {
      id: 4,
      text: "Are Sam and Lisa builders?",
      options: ["No, they aren’t.", "Yes, they are.", "No, she isn’t.", "Yes, he is."],
      correctAnswer: "No, they aren’t.",
      category: "Jobs",
      feedback: "The text says Sam and Lisa are not builders; they work in an office."
    },
    {
      id: 5,
      text: "Is Mary from Scotland?",
      options: ["No, she isn’t.", "Yes, she is.", "No, he isn’t.", "Yes, they are."],
      correctAnswer: "No, she isn’t.",
      category: "Personal Information",
      feedback: "The text says Mary is from England, not Scotland."
    },
  ];

const passageText = `My friend Anna is a nurse. She works in a hospital and helps people every day. My friend Tom is a man, and he is married. His wife is nice. Anna lives at 12 Park Street, near the park. I also have friends named Sam and Lisa. They are not builders; they work in an office. Finally, my friend Mary is not from Scotland. She is from England.`;

const BeginnerReadingComprehensionQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number | null>(null);

  const sentences = passageText.split(/(?<=[.!?])\s+/);
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  // Load TTS voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setVoicesLoaded(true);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Play TTS with highlighting
  const playSpeech = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIndex(null);
      return;
    }
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }
    setIsPlaying(true);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang === 'en-US') || voices[0];
    let index = currentSentenceIndex !== null && isPaused ? currentSentenceIndex : 0;

    const speakNext = () => {
      if (index >= sentences.length) {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentSentenceIndex(null);
        return;
      }
      setCurrentSentenceIndex(index);
      const utterance = new SpeechSynthesisUtterance(sentences[index]);
      utterance.voice = voice || null;
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 0.9;
      utterance.volume = 1.0;
      utterance.onend = () => { index++; speakNext(); };
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentSentenceIndex(null);
      };
      window.speechSynthesis.speak(utterance);
    };
    window.speechSynthesis.cancel();
    speakNext();
  };

  // Pause/resume TTS
  const pauseSpeech = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    if (answer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setCurrentQuestion(currentQuestion + 1);
  };

  if (currentQuestion >= quizData.length) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Quiz Complete!</h2>
        <p style={textStyle}>Your score: {score} out of {quizData.length}</p>
        <p style={textStyle}>Percentage: {((score / quizData.length) * 100).toFixed(0)}%</p>
        <button style={buttonStyle} onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  const current = quizData[currentQuestion];

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Beginner Reading Comprehension Quiz</h1>
      <p style={descriptionStyle}>Read or listen to the passage below and answer questions about personal information and jobs.</p>

      <div style={passageStyle}>
        <h3 style={subHeaderStyle}>All About My Friends</h3>
        <p style={textStyle}>
          {sentences.map((sentence, index) => (
            <span
              key={index}
              style={{
                display: 'inline-block',
                backgroundColor: currentSentenceIndex === index ? '#fff3cd' : 'transparent',
                transition: 'background-color 0.3s ease',
              }}
            >
              {sentence}{' '}
            </span>
          ))}
        </p>
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <motion.button
            onClick={playSpeech}
            style={{
              ...buttonStyle,
              backgroundColor: isPlaying && !isPaused ? '#e74c3c' : '#2ecc71',
            }}
            whileHover={{ scale: 1.05 }}
            disabled={!voicesLoaded}
          >
            {isPlaying && !isPaused ? 'Stop' : 'Play'}
          </motion.button>
          <motion.button
            onClick={pauseSpeech}
            style={{
              ...buttonStyle,
              backgroundColor: isPaused ? '#f1c40f' : '#e67e22',
            }}
            whileHover={{ scale: 1.05 }}
            disabled={!isPlaying || !voicesLoaded}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </motion.button>
        </div>
      </div>

      <div style={progressStyle}>
        <p style={textStyle}>Question {currentQuestion + 1} of {quizData.length}</p>
        <progress value={progress} max="100" style={progressBarStyle} />
      </div>

      <div style={questionStyle}>
        <h3 style={questionHeaderStyle}>{current.text}</h3>
        <p style={categoryStyle}>Category: <span style={{ fontStyle: 'italic' }}>{current.category}</span></p>
        <p style={instructionStyle}>Please select the correct answer:</p>
        {current.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={showFeedback}
            style={{
              ...optionButtonStyle,
              backgroundColor:
                showFeedback && option === current.correctAnswer
                  ? '#c3e6cb'
                  : showFeedback && option === selectedAnswer
                  ? '#f5c6cb'
                  : '#ffffff',
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {showFeedback && (
        <div style={feedbackStyle}>
          <h4 style={feedbackHeaderStyle}>Feedback</h4>
          <p style={feedbackTextStyle}>
            {selectedAnswer === current.correctAnswer
              ? 'Correct! Well done! 🎉'
              : 'Incorrect. Let’s learn from this:'}
          </p>
          <p style={textStyle}>{current.feedback}</p>
          <button style={nextButtonStyle} onClick={nextQuestion}>
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

// Styles (unchanged except where noted)
const containerStyle = {
  maxWidth: '780px',
  margin: '0 auto',
  padding: '30px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: '#f0f4f8',
  borderRadius: '15px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const headerStyle = {
  color: '#2c3e50',
  fontSize: '2.2em',
  marginBottom: '10px',
  textAlign: 'center' as const,
};

const descriptionStyle = {
  color: '#7f8c8d',
  fontSize: '1.1em',
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const passageStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  marginBottom: '30px',
};

const subHeaderStyle = {
  color: '#34495e',
  fontSize: '1.5em',
  marginBottom: '10px',
};

const textStyle = {
  color: '#555',
  fontSize: '1em',
  lineHeight: '1.6',
};

const progressStyle = {
  marginBottom: '25px',
};

const progressBarStyle = {
  width: '100%',
  height: '10px',
  borderRadius: '5px',
  backgroundColor: '#dfe6e9',
};

const questionStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const questionHeaderStyle = {
  color: '#2c3e50',
  fontSize: '1.4em',
  marginBottom: '15px',
};

const categoryStyle = {
  color: '#7f8c8d',
  fontSize: '0.95em',
  marginBottom: '10px',
};

const instructionStyle = {
  color: '#636e72',
  fontSize: '1em',
  marginBottom: '15px',
};

const optionButtonStyle = {
  display: 'block' as const,
  width: '100%',
  padding: '12px 15px',
  margin: '8px 0',
  fontSize: '1em',
  color: '#333',
  backgroundColor: '#ffffff',
  border: '1px solid #dfe6e9',
  borderRadius: '8px',
  textAlign: 'left' as const,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
};

const feedbackStyle = {
  marginTop: '25px',
  padding: '15px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const feedbackHeaderStyle = {
  color: '#34495e',
  fontSize: '1.3em',
  marginBottom: '10px',
};

const feedbackTextStyle = {
  color: '#2c3e50',
  fontSize: '1.1em',
  fontWeight: '500' as const,
};

const buttonStyle = {
  padding: '12px 25px',
  fontSize: '1em',
  color: '#fff',
  backgroundColor: '#3498db',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

const nextButtonStyle = {
  ...buttonStyle,
  marginTop: '15px',
};

export default BeginnerReadingComprehensionQuiz;