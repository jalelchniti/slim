import { useState } from 'react';
import { Link } from 'react-router-dom';

const sections = ['grammar', 'vocabulary', 'listening', 'reading'];
const questions = {
  A1_2: {
    grammar: [
      { type: 'mc', question: 'She ___ to school every day.', options: ['go', 'goes', 'going'], answer: 'goes', sublevel: 'A1-2', curriculumUnit: 3 },
      { type: 'fill', question: 'They ___ (not/like) coffee.', answer: "don't like", sublevel: 'A1-2', curriculumUnit: 5 },
      { type: 'mc', question: '___ he play football?', options: ['Do', 'Does', 'Is'], answer: 'Does', sublevel: 'A1-2', curriculumUnit: 5 },
    ],
    vocabulary: [
      { type: 'mc', question: 'My sister is a ___.', options: ['nurse', 'car', 'house'], answer: 'nurse', sublevel: 'A1-2', curriculumUnit: 4 },
      { type: 'fill', question: 'The sky is ___ on a sunny day.', answer: 'blue', sublevel: 'A1-2', curriculumUnit: 4 },
      { type: 'mc', question: 'I go to school on ___.', options: ['Monday', 'Table', 'Red'], answer: 'Monday', sublevel: 'A1-2', curriculumUnit: 3 },
    ],
    listening: [
      { type: 'mc', question: 'What does Sara do?', options: ['Reads', 'Plays', 'Sleeps'], answer: 'Plays', hiddenText: 'My name is Sara. I play with my friends. We like the park.', sublevel: 'A1-2', curriculumUnit: 5 },
      { type: 'mc', question: 'Where is Mark?', options: ['School', 'House', 'Shop'], answer: 'School', hiddenText: 'My name is Mark. I am at school. My teacher is nice.', sublevel: 'A1-2', curriculumUnit: 3 },
      { type: 'mc', question: 'What is Anna’s job?', options: ['Doctor', 'Student', 'Teacher'], answer: 'Doctor', hiddenText: 'My name is Anna. I am a doctor. I work in a hospital.', sublevel: 'A1-2', curriculumUnit: 4 },
    ],
    reading: [
      { type: 'mc', question: 'What does John like?', options: ['Books', 'Cats', 'Cars'], answer: 'Cats', text: 'My name is John. I have a cat. My cat is white. I like my cat.', sublevel: 'A1-2', curriculumUnit: 4 },
      { type: 'mc', question: 'Where does Maria live?', options: ['House', 'School', 'Park'], answer: 'House', text: 'My name is Maria. I live in a house. My house is small. I have a dog.', sublevel: 'A1-2', curriculumUnit: 5 },
      { type: 'mc', question: 'What does Tom do?', options: ['Plays', 'Reads', 'Sleeps'], answer: 'Plays', text: 'My name is Tom. I play football with my friends. We go to the park. The park is big.', sublevel: 'A1-2', curriculumUnit: 5 },
    ],
  },
};

// Rest of the file (ConfirmA1_2Page component) remains unchanged
const ConfirmA1_2Page = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [scores, setScores] = useState<{ [key: string]: number }>({});

  const currentSection = sections[step] || 'results';
  const sectionLengths = {
    grammar: questions.A1_2.grammar.length,
    vocabulary: questions.A1_2.vocabulary.length,
    listening: questions.A1_2.listening.length,
    reading: questions.A1_2.reading.length,
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
      [`A1_2-${section}-${index}`]: answer,
    }));
  };

  const calculateScore = (section: string) => {
    let totalScore = 0;
    questions.A1_2[section].forEach((q, i) => {
      const userAnswer = answers[`A1_2-${section}-${i}`];
      if (userAnswer === q.answer) totalScore += 1;
    });
    setScores((prev) => ({ ...prev, [`A1_2-${section}`]: totalScore }));
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

  const renderQuestion = (section: string, q: any, index: nationwide) => {
    const key = `A1_2-${section}-${index}`;
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
    const level = passed ? 'A1-2' : 'A1-1';
    const feedback = {
      grammar: scores['A1_2-grammar'] < 2 ? 'Review present simple and questions.' : 'Good grammar!',
      vocabulary: scores['A1_2-vocabulary'] < 2 ? 'Practice jobs and colors.' : 'Strong vocabulary!',
      listening: scores['A1_2-listening'] < 2 ? 'Practice short spoken texts.' : 'Great listening!',
      reading: scores['A1_2-reading'] < 2 ? 'Practice short texts.' : 'Good reading!',
    };

    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">A1-2 Confirmation Test Results</h2>
        <p className="text-base mb-2">Grammar: {scores['A1_2-grammar'] || 0}/{sectionLengths.grammar} - {feedback.grammar}</p>
        <p className="text-base mb-2">Vocabulary: {scores['A1_2-vocabulary'] || 0}/{sectionLengths.vocabulary} - {feedback.vocabulary}</p>
        <p className="text-base mb-2">Listening: {scores['A1_2-listening'] || 0}/{sectionLengths.listening} - {feedback.listening}</p>
        <p className="text-base mb-2">Reading: {scores['A1_2-reading'] || 0}/{sectionLengths.reading} - {feedback.reading}</p>
        <p className="text-base mb-2">Total Score: {totalScore}/12</p>
        <p className="text-base font-medium mb-4">Confirmed Level: {level}</p>
        <p className="text-sm text-gray-600 mb-4">
          {passed ? 'Start with Units 3-5 to strengthen A1-2 skills.' : 'Start with Units 1-2 to build A1-1 skills.'}
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
      <h1 className="text-3xl font-bold text-center mb-4">A1-2 Confirmation Test</h1>
      <p className="text-center mb-4">This test confirms your A1-2 level or suggests A1-1.</p>
      {step < sections.length ? (
        <div>
          <h2 className="text-xl font-medium mb-4">{currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}</h2>
          {questions.A1_2[currentSection].map((q, i) => (
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

export default ConfirmA1_2Page;