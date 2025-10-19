import { useState } from 'react';
import { Link } from 'react-router-dom';

// Define interfaces for the question types
interface McQuestion {
  type: 'mc';
  question: string;
  options: string[];
  answer: string;
  sublevel: string;
  curriculumUnit: number;
  hiddenText?: string;
  text?: string;
}

interface FillQuestion {
  type: 'fill';
  question: string;
  answer: string;
  sublevel: string;
  curriculumUnit: number;
  hiddenText?: string;
  text?: string;
}

// Create a union type for the questions
type Question = McQuestion | FillQuestion;

const sections = ['grammar', 'vocabulary', 'listening', 'reading'];

const questions: { A1: { [key: string]: Question[] } } = {
  A1: {
    grammar: [
      { type: 'mc', question: 'I ___ happy.', options: ['am', 'is', 'are'], answer: 'am', sublevel: 'A1-1', curriculumUnit: 1 },
      { type: 'fill', question: 'She ___ (to be) a teacher.', answer: 'is', sublevel: 'A1-1', curriculumUnit: 1 },
      { type: 'mc', question: 'They ___ students.', options: ['is', 'are', 'am'], answer: 'are', sublevel: 'A1-1', curriculumUnit: 3 },
      { type: 'fill', question: 'He ___ (not/play) tennis.', answer: "doesn't play", sublevel: 'A1-2', curriculumUnit: 5 },
      { type: 'mc', question: '___ you live in a house?', options: ['Do', 'Does', 'Is'], answer: 'Do', sublevel: 'A1-2', curriculumUnit: 5 },
      { type: 'fill', question: 'We ___ (always/go) to the park.', answer: 'always go', sublevel: 'A1-3', curriculumUnit: 6 },
    ],
    vocabulary: [
      { type: 'mc', question: 'I read a ___.', options: ['book', 'car', 'house'], answer: 'book', sublevel: 'A1-1', curriculumUnit: 1 },
      { type: 'fill', question: 'My ___ is a doctor.', answer: 'father', sublevel: 'A1-1', curriculumUnit: 4 },
      { type: 'mc', question: 'The tree is ___ in summer.', options: ['green', 'red', 'blue'], answer: 'green', sublevel: 'A1-2', curriculumUnit: 4 },
      { type: 'fill', question: 'The sun is ___.', answer: 'yellow', sublevel: 'A1-2', curriculumUnit: 2 },
      { type: 'mc', question: 'I drink ___ in the morning.', options: ['tea', 'lunch', 'dinner'], answer: 'tea', sublevel: 'A1-3', curriculumUnit: 6 },
      { type: 'fill', question: 'We buy food at a ___.', answer: 'shop', sublevel: 'A1-3', curriculumUnit: 8 },
    ],
    listening: [
      { type: 'mc', question: "What is Tom's job?", options: ['Teacher', 'Student', 'Cook'], answer: 'Teacher', hiddenText: 'My name is Tom. I am a teacher.', sublevel: 'A1-1', curriculumUnit: 3 },
      { type: 'mc', question: 'Where is Anna?', options: ['House', 'School', 'Park'], answer: 'House', hiddenText: 'My name is Anna. I am at my house. It is big.', sublevel: 'A1-1', curriculumUnit: 2 },
      { type: 'mc', question: 'What does Maria like?', options: ['Cats', 'Books', 'Cars'], answer: 'Cats', hiddenText: 'My name is Maria. I like cats. They are white.', sublevel: 'A1-2', curriculumUnit: 4 },
      { type: 'mc', question: "What is Lisa's school like?", options: ['Big', 'Small', 'Old'], answer: 'Big', hiddenText: 'My name is Lisa. I go to school. My school is big. I have a friend.', sublevel: 'A1-3', curriculumUnit: 6 },
      { type: 'mc', question: 'What does John do?', options: ['Plays', 'Sleeps', 'Reads'], answer: 'Plays', hiddenText: 'My name is John. I play in the park. It is fun.', sublevel: 'A1-3', curriculumUnit: 5 },
    ],
    reading: [
      { type: 'mc', question: 'Where is John from?', options: ['Spain', 'Brazil', 'Japan'], answer: 'Spain', text: 'My name is John. I am from Spain. I am a student.', sublevel: 'A1-1', curriculumUnit: 2 },
      { type: 'mc', question: 'What does Anna have?', options: ['Cat', 'Dog', 'Bird'], answer: 'Cat', text: 'My name is Anna. I have a cat. My cat is small.', sublevel: 'A1-2', curriculumUnit: 4 },
      { type: 'mc', question: 'What does Maria do?', options: ['Plays', 'Reads', 'Sleeps'], answer: 'Plays', text: 'My name is Maria. I play with my friends. We go to the park.', sublevel: 'A1-2', curriculumUnit: 5 },
      { type: 'mc', question: "What is Tom's house like?", options: ['Big', 'Small', 'Old'], answer: 'Big', text: 'My name is Tom. I live in a house. My house is big. I have a dog. My dog is black. I go to the park.', sublevel: 'A1-3', curriculumUnit: 8 },
      { type: 'mc', question: 'What does Lisa like?', options: ['School', 'Park', 'Shop'], answer: 'Park', text: 'My name is Lisa. I go to the park on weekends. I play with my dog. My dog is small. The park is green. I like the park.', sublevel: 'A1-3', curriculumUnit: 6 },
    ],
  },
};

const A1PlacementEvaluationPage = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [scores, setScores] = useState<{ [key: string]: number }>({});

  const currentSection = sections[step] || 'results';
  const sectionLengths = {
    grammar: questions.A1.grammar.length,
    vocabulary: questions.A1.vocabulary.length,
    listening: questions.A1.listening.length,
    reading: questions.A1.reading.length,
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
      [`A1-${section}-${index}`]: answer,
    }));
  };

  const calculateScore = (section: string) => {
    let totalScore = 0;
    questions.A1[section].forEach((q, i) => {
      const userAnswer = answers[`A1-${section}-${i}`];
      if (userAnswer === q.answer) totalScore += 1;
    });
    setScores((prev) => ({ ...prev, [`A1-${section}`]: totalScore }));
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

  const renderQuestion = (section: string, q: Question, index: number) => {
    const key = `A1-${section}-${index}`;
    return (
      <div className="mb-4">
        <p className="text-base font-medium mb-2">{q.question}</p>
        {q.hiddenText && (
          <div className="mb-2">
            <button
              onClick={() => playTTS(q.hiddenText!)}
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
            {(q as McQuestion).options.map((opt: string) => (
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
    const level = totalScore >= 16 ? 'A1-3' : totalScore >= 10 ? 'A1-2' : 'A1-1';
    const confirmPath = level === 'A1-2' ? '/confirm-a1-2' : '/confirm-a1-3';
    const feedback = {
      grammar: scores['A1-grammar'] < 4 ? 'Review present simple (am/is/are) and basic questions.' : 'Good grammar skills!',
      vocabulary: scores['A1-vocabulary'] < 4 ? 'Practice basic nouns (book, shop) and adjectives (green, yellow).' : 'Strong vocabulary!',
      listening: scores['A1-listening'] < 3 ? 'Practice understanding short spoken sentences.' : 'Great listening skills!',
      reading: scores['A1-reading'] < 3 ? 'Practice reading short texts (notices, emails).' : 'Excellent reading comprehension!',
    };

    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">A1 Placement Test Results</h2>
        <p className="text-base mb-2">Grammar: {scores['A1-grammar'] || 0}/{sectionLengths.grammar} - {feedback.grammar}</p>
        <p className="text-base mb-2">Vocabulary: {scores['A1-vocabulary'] || 0}/{sectionLengths.vocabulary} - {feedback.vocabulary}</p>
        <p className="text-base mb-2">Listening: {scores['A1-listening'] || 0}/{sectionLengths.listening} - {feedback.listening}</p>
        <p className="text-base mb-2">Reading: {scores['A1-reading'] || 0}/{sectionLengths.reading} - {feedback.reading}</p>
        <p className="text-base mb-2">Total Score: {totalScore}/22</p>
        <p className="text-base font-medium mb-4">Recommended Level: {level}</p>
        <p className="text-sm text-gray-600 mb-4">
          {level === 'A1-1' && 'Start with Units 1-2 in the curriculum to build basic skills.'}
          {level === 'A1-2' && 'Continue with Units 3-5 to strengthen beginner skills.'}
          {level === 'A1-3' && 'Advance with Units 6-8 to improve upper beginner skills.'}
        </p>
        {level === 'A1-1' ? (
          <Link
            to="/curriculum"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start A1-1 Lessons
          </Link>
        ) : (
          <Link
            to={confirmPath}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Confirm your level
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">A1 Level Placement Test</h1>
      <p className="text-center mb-4">This test helps find the best A1 course level for you (A1-1, A1-2, or A1-3).</p>
      {step < sections.length ? (
        <div>
          <h2 className="text-xl font-medium mb-4">{currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}</h2>
          {questions.A1[currentSection].map((q: Question, i: number) => (
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

export default A1PlacementEvaluationPage;