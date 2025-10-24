import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface GrammarItem {
  id: string;
  title: string;
  content: string;
  level: string;
  topic: string;
  quizId?: string;
  flashcardId?: string;
}

const GrammarPage = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');

  const grammarContent: GrammarItem[] = [
    // Unit 1
    {
      id: 'gr_01-01',
      title: 'Verb To Be',
      content: 'Practice using the verb "to be" in simple sentences.',
      level: 'A1',
      topic: 'Verbs',
      quizId: 'gr_01-01',
    },
    {
      id: 'gr_01-02',
      title: 'Present Simple',
      content: 'Learn the present simple tense for habits and facts.',
      level: 'A1',
      topic: 'Tenses',
      flashcardId: 'gr_01-02',
    },
    {
      id: 'gr_01-03',
      title: 'Yes/No Questions',
      content: 'Practice yes/no questions with short answers.',
      level: 'A1',
      topic: 'Tenses',
      quizId: 'gr_01-03',
    },
    {
      id: 'gr_01-04',
      title: 'Yes/No Flashcards',
      content: 'Flashcards for yes/no questions with short answers.',
      level: 'A1',
      topic: 'Tenses',
      flashcardId: 'gr_01-04',
    },
    // Unit 2
    {
      id: 'gr_02-01',
      title: 'Imperatives for Directions',
      content: 'Learn how to use imperative forms to give directions.',
      level: 'A1',
      topic: 'Verbs',
      quizId: 'gr_02-01',
    },
    {
      id: 'gr_02-02',
      title: 'Asking Questions',
      content: 'Master question formation for asking directions and information.',
      level: 'A1',
      topic: 'Questions',
      quizId: 'gr_02-02',
    },
    {
      id: 'gr_02-03',
      title: 'Prepositions of Place & Direction',
      content: 'Practice prepositions used for locations and directions.',
      level: 'A1',
      topic: 'Prepositions',
      quizId: 'gr_02-03',
    },
    {
      id: 'gr_02-04',
      title: 'Modal Verbs & Polite Requests',
      content: 'Learn modal verbs to make polite requests and ask for help.',
      level: 'A1',
      topic: 'Verbs',
      quizId: 'gr_02-04',
    },
  ];

  const filteredGrammar = selectedTopic === 'All Topics'
    ? grammarContent
    : grammarContent.filter((item) => item.topic === selectedTopic);

  const allTopics = Array.from(new Set(grammarContent.map((item) => item.topic)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full max-w-5xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl"
    >
      <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">Grammar Practice</h1>
      <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center">
        Improve your beginner English grammar skills with interactive practice and explanations.
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
        {filteredGrammar.length > 0 ? (
          filteredGrammar.map((item) => (
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
          <div className="text-gray-700 text-center">No grammar content available for this selection.</div>
        )}
      </div>
    </motion.div>
  );
};

export default GrammarPage;
