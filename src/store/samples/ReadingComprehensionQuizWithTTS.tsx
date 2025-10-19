import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckSquare, ChevronLeft, ChevronRight, RefreshCcw, Volume2, VolumeX, Pause, Play } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const article = {
  title: "A Delayed Flight",
  content: `
    Alex was excited to go on vacation. He arrived at the airport two hours early for his flight to Cancun. After checking his luggage, he went through security and found his gate.

    He sat down and waited, watching other passengers board their flights. Suddenly, an announcement came over the loudspeaker: "Flight 456 to Cancun is delayed due to bad weather." Alex sighed.

    He checked the flight status on his phone. The new departure time was three hours later. Alex decided to find a coffee shop and read a book.

    Finally, after a long wait, the announcement came that his flight was boarding. Alex was relieved and ready for his vacation to begin.
  `,
  vocabulary: [
    { word: "delayed", definition: "postponed or late" },
    { word: "departure", definition: "the act of leaving" },
    { word: "relieved", definition: "feeling happy because something unpleasant has stopped" },
  ],
};

const questions: Question[] = [
  {
    id: 1,
    text: "Where is Alex flying to?",
    options: ["Paris", "Cancun", "London", "Rome"],
    correctAnswer: 1,
  },
  {
    id: 2,
    text: "How early did Alex arrive at the airport?",
    options: ["One hour", "Two hours", "Three hours", "Four hours"],
    correctAnswer: 1,
  },
  {
    id: 3,
    text: "What was the reason for the delay?",
    options: ["Mechanical issues", "Bad weather", "Staff shortage", "Security check"],
    correctAnswer: 1,
  },
  {
    id: 4,
    text: "How did Alex spend his time during the delay?",
    options: ["Sleeping", "Shopping", "Reading", "Eating"],
    correctAnswer: 2,
  },
];

const TravelDelayReadingComprehension = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [highlightedSentence, setHighlightedSentence] = useState<number | null>(null);

  const currentQuestion = questions[currentIndex];
  const sentences = article.content.split('\n').filter(s => s.trim() !== '').map(s => s.trim());

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speakPassage = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setHighlightedSentence(null);
      return;
    }

    setIsSpeaking(true);
    let sentenceIndex = highlightedSentence || 0;
    const speakNextSentence = () => {
      if (sentenceIndex >= sentences.length) {
        setIsSpeaking(false);
        setIsPaused(false);
        setHighlightedSentence(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentences[sentenceIndex]);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.voice = voices.find(v => v.lang === 'en-US') || voices[0];
      utterance.onstart = () => setHighlightedSentence(sentenceIndex);
      utterance.onend = () => {
        sentenceIndex++;
        if (!isPaused) speakNextSentence();
      };
      window.speechSynthesis.speak(utterance);
    };

    speakNextSentence();
  };

  const pauseReading = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeReading = () => {
    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      if (highlightedSentence !== null) {
        const speakNext = () => {
          if (!window.speechSynthesis.paused && !window.speechSynthesis.speaking) speakPassage();
        };
        setTimeout(speakNext, 100);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
    }
  };

  const handleSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = answerIndex;
    setUserAnswers(newAnswers);
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setIsSpeaking(false);
    setIsPaused(false);
    window.speechSynthesis.cancel();
    setHighlightedSentence(null);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setUserAnswers(Array(questions.length).fill(null));
    setIsSubmitted(false);
    setIsSpeaking(false);
    setIsPaused(false);
    window.speechSynthesis.cancel();
    setHighlightedSentence(null);
  };

  const isCorrect = (index: number) => {
    return userAnswers[index] === questions[index].correctAnswer;
  };

  const totalScore = userAnswers.filter((answer, index) => isCorrect(index)).length;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden min-h-screen flex flex-col">
      <header className="bg-green-700 text-white p-6 flex items-center justify-between">
        <h3 className="text-4xl font-bold">{article.title}</h3>
        <div className="flex gap-3">
          <Button
            onClick={speakPassage}
            disabled={voices.length === 0}
            className={`px-5 py-2.5 ${isSpeaking ? 'bg-red-700 hover:bg-red-800' : 'bg-green-600 hover:bg-green-700'} text-white rounded-full flex items-center gap-2 text-lg`}
          >
            {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
            {isSpeaking ? 'Stop' : 'Read'}
          </Button>
          <Button
            onClick={pauseReading}
            disabled={!isSpeaking || isPaused}
            className={`px-5 py-2.5 ${!isSpeaking || isPaused ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} text-white rounded-full flex items-center gap-2 text-lg`}
          >
            <Pause size={20} />
            Pause
          </Button>
          <Button
            onClick={resumeReading}
            disabled={!isSpeaking || !isPaused}
            className={`px-5 py-2.5 ${!isSpeaking || !isPaused ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} text-white rounded-full flex items-center gap-2 text-lg`}
          >
            <Play size={20} />
            Resume
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        {!isSubmitted ? (
          <>
            <div className="mb-8 bg-green-50 p-6 rounded-xl">
              {sentences.map((sentence, index) => (
                <motion.p
                  key={index}
                  className={`mb-4 text-lg leading-relaxed ${
                    highlightedSentence === index ? 'bg-green-200' : ''
                  }`}
                >
                  {sentence}
                </motion.p>
              ))}
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-semibold mb-4 text-green-800">Vocabulary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {article.vocabulary.map(({ word, definition }, index) => (
                  <div key={index} className="bg-green-50 p-4 rounded-lg">
                    <span className="font-semibold text-green-700">{word}</span>: {definition}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-semibold text-green-800">
                  Question {currentIndex + 1} of {questions.length}
                </h4>
              </div>

              <p className="text-lg mb-6">{currentQuestion.text}</p>

              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    className={`p-4 text-left rounded-lg transition-colors ${
                      selectedAnswer === index
                        ? 'bg-green-600 text-white'
                        : 'bg-white hover:bg-green-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <ChevronLeft size={20} /> Previous
                </Button>

                {currentIndex === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={userAnswers.some(answer => answer === null)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    Submit <CheckSquare size={20} />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    Next <ChevronRight size={20} />
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-green-50 p-6 rounded-xl">
            <h4 className="text-2xl font-semibold mb-6 text-center text-green-800">
              Quiz Results
            </h4>
            <div className="text-4xl font-bold text-center mb-8">
              Score: {totalScore} / {questions.length}
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    isCorrect(index) ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <p className="font-semibold mb-2">{question.text}</p>
                  <p>Your answer: {question.options[userAnswers[index] || 0]}</p>
                  <p>Correct answer: {question.options[question.correctAnswer]}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={handleReset}
              className="mt-8 mx-auto block bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <RefreshCcw size={20} /> Try Again
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default TravelDelayReadingComprehension;
