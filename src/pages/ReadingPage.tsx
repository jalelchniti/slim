import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ReadingItem {
  id: string;
  title: string;
  content: string;
  level: string;
  topic: string;
  quizId?: string;
}

const ReadingPage = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');

  const readingContent: ReadingItem[] = [
    // Unit 1
    {
      id: 're_01-01',
      title: 'All About You',
      content: 'Read about jobs and personal information.',
      level: 'A1',
      topic: 'Personal Information',
      quizId: 're_01-01'
    },
    {
      id: 're_01-02',
      title: "Anna's Daily Life",
      content: "Read about Anna's house and daily routine.",
      level: 'A1',
      topic: 'Short Texts',
      quizId: 're_01-02'
    },
    { id: 're_01-03', title: 'Basic Notices', content: 'Read signs, notices, and short texts.', level: 'A1', topic: 'Notices' },
    { id: 're_01-04', title: 'Family and Friends', content: 'Understand texts about family and friends.', level: 'A1', topic: 'Relationships' },
    // Unit 2
    {
      id: 're_02-01',
      title: 'Shopping Information',
      content: 'Read store information, hours, and special offers.',
      level: 'A1',
      topic: 'Shopping',
      quizId: 're_02-01'
    },
    {
      id: 're_02-02',
      title: 'Directions',
      content: 'Read and understand step-by-step navigation instructions.',
      level: 'A1',
      topic: 'Directions',
      quizId: 're_02-02'
    },
    {
      id: 're_02-03',
      title: 'Shopping Dialogue',
      content: 'Read and understand conversations between customers and cashiers.',
      level: 'A1',
      topic: 'Conversations',
      quizId: 're_02-03'
    },
    {
      id: 're_02-04',
      title: 'Return & Exchange Policy',
      content: 'Read and understand store policies and procedures.',
      level: 'A1',
      topic: 'Notices',
      quizId: 're_02-04'
    },
  ];

  const filteredReading = selectedTopic === 'All Topics'
    ? readingContent
    : readingContent.filter((item) => item.topic === selectedTopic);

  const allTopics = Array.from(new Set(readingContent.map((item) => item.topic)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full max-w-5xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl"
    >
      <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">Reading Practice</h1>
      <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center">
        Improve your beginner English reading skills with interactive practice and explanations.
      </p>

      <div className="w-full sm:w-auto mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredReading.length > 0 ? (
          filteredReading.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-indigo-700 mb-2">{item.title}</h3>
              <p className="text-gray-700 mb-4">{item.content}</p>
              <div className="flex justify-between items-center">
                {item.quizId ? (
                  <Link
                    to={`/quiz/${item.quizId}`}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <motion.button
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Take Quiz
                    </motion.button>
                  </Link>
                ) : (
                  <span className="text-sm text-gray-500">Practice Coming Soon</span>
                )}
                <span className="bg-indigo-50 text-indigo-600 text-sm font-medium px-2.5 py-0.5 rounded">
                  {item.level} | {item.topic}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-gray-700 text-center">No reading content available for this selection.</div>
        )}
      </div>
    </motion.div>
  );
};

export default ReadingPage;