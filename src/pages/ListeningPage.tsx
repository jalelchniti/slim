import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ListeningItem {
  id: string;
  title: string;
  level: string;
  topic: string;
}

const ListeningPage = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');

  const listeningContent: ListeningItem[] = [
    // Unit 1
    { id: 'li_01-01', title: 'Short Conversations (A1)', level: 'A1', topic: 'Conversations' },
    // Unit 2
    { id: 'li_02-01', title: 'Understanding Directions', level: 'A1', topic: 'Directions' },
    { id: 'li_02-02', title: 'Shopping Conversations', level: 'A1', topic: 'Shopping' },
    { id: 'li_02-03', title: 'Landmarks & Locations', level: 'A1', topic: 'Directions' },
    { id: 'li_02-04', title: 'Prices & Numbers', level: 'A1', topic: 'Shopping' },
  ];

  const filteredListening = selectedTopic === 'All Topics'
    ? listeningContent
    : listeningContent.filter((item) => item.topic === selectedTopic);

  const allTopics = Array.from(new Set(listeningContent.map((item) => item.topic)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full max-w-5xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl"
    >
      <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">Listening Practice</h1>
      <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center">
        Improve your beginner English listening skills with interactive practice and explanations.
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
        {filteredListening.length > 0 ? (
          filteredListening.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-indigo-700 mb-2">{item.title}</h3>
              <div className="flex justify-between items-center">
                {(item.id.startsWith('li_01-') || item.id.startsWith('li_02-')) ? (
                  <Link
                    to={`/quiz/${item.id}`}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Start Practice
                  </Link>
                ) : (
                  <span className="text-sm text-gray-500">Practice Coming Soon</span>
                )}
                <span className="bg-indigo-50 text-indigo-600 text-sm font-medium px-2.5 py-0.5 rounded">
                  {item.level} | {item.topic}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-700 text-center">No listening content available for this selection.</div>
        )}
      </div>
    </motion.div>
  );
};

export default ListeningPage;