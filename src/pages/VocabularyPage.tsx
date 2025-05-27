import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface VocabularyItem {
  id: string;
  title: string;
  content: string;
  level: string;
  topic: string;
  quizId?: string;
  flashcardId?: string;
}

const VocabularyPage = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');

  const vocabularyContent: VocabularyItem[] = [
    {
      id: 'vo_01-01',
      title: 'Introductions Flashcards',
      content: 'Practice basic vocabulary for greetings and personal information using flashcards.',
      level: 'A1',
      topic: 'Introductions',
      flashcardId: 'vo_01-01',
    },
    {
      id: 'vo_01-02',
      title: 'Introductions Quiz',
      content: 'Practice basic vocabulary for greetings and personal information.',
      level: 'A1',
      topic: 'Introductions',
      quizId: 'vo_01-02',
    },
    {
      id: 'vo_01-03',
      title: 'Everyday Objects Flashcards',
      content: 'Practice common objects around you with flashcards.',
      level: 'A1',
      topic: 'Everyday Objects',
      flashcardId: 'vo_01-03',
    },
    {
      id: 'vo_01-04',
      title: 'Classroom Objects Flashcards',
      content: 'Practice vocabulary related to classroom objects using flashcards.',
      level: 'A1',
      topic: 'Classroom Objects',
      flashcardId: 'vo_01-04',
    },
  ];

  const filteredVocabulary = selectedTopic === 'All Topics'
    ? vocabularyContent
    : vocabularyContent.filter((item) => item.topic === selectedTopic);

  const allTopics = Array.from(new Set(vocabularyContent.map((item) => item.topic)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full max-w-5xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl"
    >
      <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">Vocabulary Practice & Quizzes</h1>
      <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center">
        Improve your English vocabulary with interactive practice, quizzes, and flashcards.
      </p>

      <div className="flex flex-wrap w-full mb-8 gap-4 justify-center">
        <div className="w-full sm:w-auto">
          <label htmlFor="topic-select" className="block text-sm font-medium text-gray-700 mb-2 text-center sm:text-left">
            Sort by Topic
          </label>
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-5 py-2.5 rounded-full bg-white text-gray-800 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:shadow-md w-full sm:w-auto"
          >
            <option value="All Topics">All Topics</option>
            {allTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredVocabulary.length > 0 ? (
          filteredVocabulary.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-indigo-700 mb-2">{item.title}</h3>
              <p className="text-gray-700 mb-4">{item.content}</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  {item.quizId && (
                    <Link
                      to={`/quiz/${item.quizId}`}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      Practice Quiz
                    </Link>
                  )}
                  {item.flashcardId && (
                    <Link
                      to={`/quiz/${item.flashcardId}`}
                      className="text-sm text-green-600 hover:underline text-center"
                    >
                      Flashcard Practice
                    </Link>
                  )}
                  <span className="bg-indigo-50 text-indigo-600 text-sm font-medium px-2.5 py-0.5 rounded">
                    {item.level} | {item.topic}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-700">No vocabulary quizzes available yet.</div>
        )}
      </div>
    </motion.div>
  );
};

export default VocabularyPage;