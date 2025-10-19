import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="space-y-10">
      {/* Hero Section - SmartHub Banner */}
      <section
        className="relative overflow-hidden rounded-2xl text-white h-64 sm:h-80 md:h-96 lg:h-[28rem] bg-cover bg-center shadow-xl"
        style={{ backgroundImage: `url('/slim/assets/images/fb_cover-01.png')` }}
      >
        {/* Optional subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

        {/* Content area - can be used for call-to-action buttons if needed */}
        <div className="relative h-full flex items-end justify-center pb-8 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4"
          >
            <Link to="/vocabulary" className="btn bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
              Start Learning
            </Link>
            <Link to="/curriculum" className="btn bg-white/90 hover:bg-white text-gray-800 shadow-lg">
              View Curriculum
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Skills Categories */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Interactive Practice Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="card p-6 h-full flex flex-col relative">
                {category.badge && (
                  <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    {category.badge}
                  </span>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${category.iconBg}`}>
                  <span className={category.iconColor}>{category.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="mt-auto pt-4">
                  <Link to={category.path} className="text-primary-600 font-medium flex items-center hover:underline">
                    Start Practice
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Featured Practice */}
      <section className="card overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-100 p-6 md:p-10">
            <span className="inline-block bg-accent-100 text-accent-800 rounded-full px-3 py-1 text-sm font-medium mb-4">
              Featured Practice
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Essential Verb Forms (A1)</h2>
            <p className="text-gray-700 mb-6">Master the verb "to be" with interactive quizzes and flashcards designed for beginners.</p>
            <div className="flex gap-4">
              <Link to="/quiz/gr_01-01" className="btn btn-primary">
                Take Quiz
              </Link>
              <Link to="/quiz/gr_01-02" className="btn bg-green-100 text-green-800 hover:bg-green-200">
                View Flashcards
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 bg-primary-700 p-6 md:p-10 text-white">
            <h3 className="text-xl font-bold mb-4">What's Included:</h3>
            <ul className="space-y-3">
              {featuredLessonPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-6 w-6 text-primary-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

// Updated Data
const categories = [
  {
    title: "Vocabulary",
    description: "Practice everyday words with interactive quizzes & flashcards",
    path: "/vocabulary",
    icon: "📚",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "New"
  },
  {
    title: "Grammar",
    description: "Master verb forms with guided exercises & flip cards",
    path: "/grammar",
    icon: "📝",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badge: "New"
  },
  {
    title: "Speaking",
    description: "Improve pronunciation with conversation activities",
    path: "/speaking",
    icon: "🗣️",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600"
  },
  {
    title: "Reading",
    description: "Develop skills with beginner-friendly texts",
    path: "/reading",
    icon: "📖",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    title: "Listening",
    description: "Enhance comprehension with audio exercises",
    path: "/listening",
    icon: "🎧",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600"
  }
];

const featuredLessonPoints = [
  "Interactive verb conjugation practice",
  "Instant feedback on answers",
  "Flashcards with audio pronunciation",
  "Progress tracking system",
  "Beginner-friendly explanations"
];

export default HomePage;