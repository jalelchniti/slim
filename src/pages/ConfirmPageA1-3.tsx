import { useState } from 'react';
import { Link } from 'react-router-dom';

const sections = ['grammar', 'vocabulary', 'listening', 'reading'];
const questions = {
  A1_3: {
    grammar: [
      { type: 'mc', question: 'They ___ (never/go) to the cinema.', options: ['never go', 'go never', 'never goes'], answer: 'never go', sublevel: 'A1-3', curriculumUnit: 6 },
      { type: 'fill', question: 'This is ___ (my/book).', answer: 'my book', sublevel: 'A1-3', curriculumUnit: 7 },
      { type: 'mc', question: 'We ___ (sometimes/eat) pizza.', options: ['sometimes eat', 'eat sometimes', 'sometimes eats'], answer: 'sometimes eat', sublevel: 'A1-3', curriculumUnit: 6 },
    ],
    vocabulary: [
      { type: 'mc', question: 'I eat ___ for breakfast.', options: ['bread', 'bed', 'chair'], answer: 'bread', sublevel: 'A1-3', curriculumUnit: 6 },
      { type: 'fill', question: 'I go to the ___ to buy clothes.', answer: 'shop', sublevel: 'A1-3', curriculumUnit: 8 },
      { type: 'mc', question: 'The clock says seven ___.', options: ['o’clock', 'table', 'red'], answer: 'o’clock', sublevel: 'A1-3', curriculumUnit: 7 },
    ],
    listening: [
      { type: 'mc', question: 'What does Lisa eat?', options: ['Bread', 'Pizza', 'Rice'], answer: 'Pizza', hiddenText: 'My name is Lisa. I eat pizza on weekends. I like pizza. It is good.', sublevel: 'A1-3', curriculumUnit: 6 },
      { type: 'mc', question: 'Where does Tom go?', options: ['Shop', 'School', 'Park'], answer: 'Shop', hiddenText: 'My name is Tom. I go to the shop. I buy bread and milk. The shop is small.', sublevel: 'A1-3', curriculumUnit: 8 },
      { type: 'mc', question: 'What is Maria’s house like?', options: ['Big', 'Small', 'Old'], answer: 'Big', hiddenText: 'My name is Maria. I live in a house. My house is big. I have a dog. My dog is black.', sublevel: 'A1-3', curriculumUnit: 8 },
    ],
    reading: [
      { type: 'mc', question: 'What does John like?', options: ['Park', 'School', 'Shop'], answer: 'Park', text: 'My name is John. I go to the park on weekends. I play with my friends. The park is green. I like the park.', sublevel: 'A1-3', curriculumUnit: 6 },
      { type: 'mc', question: 'What is Anna’s book like?', options: ['New', 'Old', 'Small'], answer: 'New', text: 'My name is Anna. I have a book. My book is new. I read it at home. I like my book.', sublevel: 'A1-3', curriculumUnit: 7 },
      { type: 'mc', question: 'Where does Tom live?', options: ['House', 'School', 'Shop'], answer: 'House', text: 'My name is Tom. I live in a house. My house is big. I have a dog. My dog is black. I go to the park.', sublevel: 'A1-3', curriculumUnit: 8 },
    ],
  },
};

const ConfirmA1_3Page = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [scores, setScores] = useState<{ [key: string]: number }>({});

  const currentSection = sections[step] || 'results';
  const sectionLengths = {
    grammar: questions.A1_3.grammar.length,
    vocabulary: questions.A1_3.vocabulary.length,
    listening: questions.A1_3.listening.length,
    reading: questions.A1_3.reading.length,
  };

  const playTTS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    const voices = window.speechSynthesis.getVoices();
    const gbVoice = voices.find((voice) => voice.lang === 'en-GB');
    if (gbVoice) utterance.voice = gbVoice;
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (section: string, index: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [`A1_3-${section}-${index}`]: answer,
    }));
  };

  const calculateScore = (section: string) => {
    let totalScore = 0;
    questions.A1_3[section].forEach((q, i) => {
      const userAnswer = answers[`A1_3-${section}-${i}`];
      if (userAnswer === q.answer) totalScore += 1;
    });
    setScores((prev) => ({ ...prev, [`A1_3-${section}`]: totalScore }));
  };

  const handleNext = () => {
    if (step < sections.length) {
      calculateScore(currentSection);
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderQuestion = (section: string, q: any, index: number) => {
    const key = `A1_3-${section}-${index}`;
    return (
      <div className="mb-4">
        <p className="text-base font-medium mb-2">{q.question}</p>
        {q.hiddenText && (
          <div className="mb-2">
            <button
              onClick={() => playTTS(q.hiddenText)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Play Audio
            </button>
            <span className="sr-only">{q.hiddenText}</span>
          </div>
        )}
        {q.text && <p className="text-sm mb-2">{q.text}</p>}
        {q.type === 'mc' && (
          <div>
            {q.options.map((opt: string) => (
              <label key={opt} className="block mb-1">
                <input
                  type="radio"
                  name={key}
                  value={opt}
                  checked={answers[key] === opt}
                  onChange={() => handleAnswer(section, index, opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        )}
        {q.type === 'fill' && (
          <input
            type="text"
            value={answers[key] || ''}
            onChange={(e) => handleAnswer(section, index, e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Type your answer"
          />
        )}
      </div>
    );
  };

  const renderResults = () => {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const passed = totalScore >= 8;
    const level = passed ? 'A1-3' : 'A1-2';
    const feedback = {
      grammar: scores['A1_3-grammar'] < 2 ? 'Review adverbs and possessives.' : 'Good grammar!',
      vocabulary: scores['A1_3-vocabulary'] < 2 ? 'Practice food and time words.' : 'Strong vocabulary!',
      listening: scores['A1_3-listening'] < 2 ? 'Practice longer spoken texts.' : 'Great listening!',
      reading: scores['A1_3-reading'] < 2 ? 'Practice longer texts.' : 'Good reading!',
    };

    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">A1-3 Confirmation Test Results</h2>
        <p className="text-base mb-2">Grammar: {scores['A1_3-grammar'] || 0}/{sectionLengths.grammar} - {feedback.grammar}</p>
        <p className="text-base mb-2">Vocabulary: {scores['A1_3-vocabulary'] || 0}/{sectionLengths.vocabulary} - {feedback.vocabulary}</p>
        <p className="text-base mb-2">Listening: {scores['A1_3-listening'] || 0}/{sectionLengths.listening} - {feedback.listening}</p>
        <p className="text-base mb-2">Reading: {scores['A1_3-reading'] || 0}/{sectionLengths.reading} - {feedback.reading}</p>
        <p className="text-base mb-2">Total Score: {totalScore}/12</p>
        <p className="text-base font-medium mb-4">Confirmed Level: {level}</p>
        <p className="text-sm text-gray-600 mb-4">
          {passed ? 'Start with Units 6-8 to improve A1-3 skills.' : 'Start with Units 3-5 to build A1-2 skills.'}
        </p>
        <Link
          to={passed ? '/curriculum' : '/curriculum'}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Start {level} Lessons
        </Link>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">A1-3 Confirmation Test</h1>
      <p className="text-center mb-4">This test confirms your A1-3 level or suggests A1-2.</p>
      {step < sections.length ? (
        <div>
          <h2 className="text-xl font-medium mb-4">{currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}</h2>
          {questions.A1_3[currentSection].map((q, i) => (
            <div key={i}>{renderQuestion(currentSection, q, i)}</div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevious}
              disabled={step === 0}
              className={`bg-gray-500 text-white px-4 py-2 rounded ${step === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {step === sections.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        renderResults()
      )}
    </div>
  );
};

export default ConfirmA1_3Page;