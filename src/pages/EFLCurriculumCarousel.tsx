// src/pages/EFLCurriculumCarousel.tsx
import React, { useState, useMemo } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { motion } from 'framer-motion';
import { FaSearch, FaChevronLeft, FaChevronRight, FaCalendar, FaClock } from 'react-icons/fa';

const courseSchedule = [
  {
    week: 'Week 1',
    theme: 'Foundation & Self-Introduction',
    duration: 'October 14-18, 2025',
    sessions: [
      {
        session: 'Session 1',
        date: 'Tuesday, October 14, 2025',
        time: '11:00-12:30',
        objective: 'Establish baseline communication skills and build rapport',
        content: 'Ice-breaking activities, assessing current English level through guided conversation, introducing survival phrases for daily interactions (greetings, basic questions, expressing needs), pronunciation fundamentals for American English, setting personal learning goals for USA transition',
      },
      {
        session: 'Session 2',
        date: 'Thursday, October 16, 2025',
        time: '11:00-12:30',
        objective: 'Develop self-presentation skills for American contexts',
        content: 'Talking about yourself (name, age, background, interests), discussing Tunisia and your hometown with Americans, explaining your educational background positively, expressing future plans and reasons for moving to USA, practicing active listening and response strategies',
      },
      {
        session: 'Session 3',
        date: 'Saturday, October 18, 2025',
        time: '11:00-12:30',
        objective: 'Master essential question formation and information gathering',
        content: 'Asking for and giving directions, inquiring about prices and services, requesting clarification when you don\'t understand, telephone basics (making appointments, leaving messages), role-play: arriving in an American city for the first time',
      },
    ],
  },
  {
    week: 'Week 2',
    theme: 'Daily Life Survival Skills',
    duration: 'October 21-25, 2025',
    sessions: [
      {
        session: 'Session 4',
        date: 'Tuesday, October 21, 2025',
        time: '11:00-12:30',
        objective: 'Navigate shopping and consumer transactions',
        content: 'Grocery shopping vocabulary and interactions, understanding American measurements and currency, ordering food at restaurants and fast-food chains, handling returns and exchanges, dealing with cashiers and service workers',
      },
      {
        session: 'Session 5',
        date: 'Thursday, October 23, 2025',
        time: '11:00-12:30',
        objective: 'Manage housing and neighborhood integration',
        content: 'Apartment hunting conversations, talking with landlords and roommates, describing housing problems and requesting repairs, introducing yourself to neighbors, understanding lease agreements through conversation',
      },
      {
        session: 'Session 6',
        date: 'Saturday, October 25, 2025',
        time: '11:00-12:30',
        objective: 'Access essential services and transportation',
        content: 'Using public transportation (asking for help, reading schedules), visiting the doctor or pharmacy, banking basics (opening accounts, understanding services), emergency situations vocabulary, calling for help when needed',
      },
    ],
  },
  {
    week: 'Week 3',
    theme: 'Social Integration & Cultural Fluency',
    duration: 'October 28 - November 1, 2025',
    sessions: [
      {
        session: 'Session 7',
        date: 'Tuesday, October 28, 2025',
        time: '11:00-12:30',
        objective: 'Build social connections and friendships',
        content: 'Making small talk with Americans (weather, sports, current events), expressing opinions and preferences, accepting and declining invitations politely, sharing about Tunisian culture, understanding American social cues and conversation norms',
      },
      {
        session: 'Session 8',
        date: 'Thursday, October 30, 2025',
        time: '11:00-12:30',
        objective: 'Navigate educational and professional environments',
        content: 'Discussing educational options (GED, community college, vocational training), job interview basics, talking about work experience and skills, understanding workplace conversation, networking and professional introductions',
      },
      {
        session: 'Session 9',
        date: 'Saturday, November 1, 2025',
        time: '11:00-12:30',
        objective: 'Handle conflicts and problem-solving situations',
        content: 'Making complaints appropriately, disagreeing politely, negotiating solutions, apologizing and accepting apologies, dealing with misunderstandings, asserting yourself respectfully in American contexts',
      },
    ],
  },
  {
    week: 'Week 4',
    theme: 'Advanced Conversation & Real-World Scenarios',
    duration: 'November 4-8, 2025',
    sessions: [
      {
        session: 'Session 10',
        date: 'Tuesday, November 4, 2025',
        time: '11:00-12:30',
        objective: 'Develop storytelling and extended speaking skills',
        content: 'Narrating personal experiences, describing past events in Tunisia, talking about future goals and dreams, using transitions to connect ideas, maintaining longer conversations without awkward silences',
      },
      {
        session: 'Session 11',
        date: 'Thursday, November 6, 2025',
        time: '11:00-12:30',
        objective: 'Master practical communication strategies',
        content: 'Using technology and apps in English (ordering Uber, using GPS, online shopping), understanding different American accents and speaking speeds, idiomatic expressions for everyday situations, slang awareness without overuse',
      },
      {
        session: 'Session 12',
        date: 'Saturday, November 8, 2025',
        time: '11:00-12:30',
        objective: 'Consolidate learning and prepare for independent communication',
        content: 'Comprehensive role-play scenarios combining all learned skills, troubleshooting common communication breakdowns, building confidence through simulated real-life situations, creating personal action plan for continued English improvement in USA, celebration of progress and final assessment',
      },
    ],
  },
];

const EFLCurriculumCarousel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Flatten sessions for filtering
  const allSessions = useMemo(() => {
    return courseSchedule.flatMap(week =>
      week.sessions.map(session => ({
        ...session,
        week: week.week,
        theme: week.theme,
        duration: week.duration,
      }))
    );
  }, []);

  // Filter sessions based on search query and selected filter
  const filteredSessions = useMemo(() => {
    let sessions = allSessions;

    // Apply week filter
    if (selectedFilter !== 'All') {
      sessions = sessions.filter(session => session.week === selectedFilter);
    }

    // Apply search query
    if (searchQuery) {
      sessions = sessions.filter(session =>
        session.session.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.theme.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return sessions;
  }, [searchQuery, selectedFilter, allSessions]);

  // Options for filter dropdown
  const filterOptions = [
    'All',
    ...courseSchedule.map(week => week.week),
  ];

  // Disable autoPlay when searching or filtering
  const shouldAutoPlay = searchQuery.length === 0 && selectedFilter === 'All';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">Conversational English Course</h1>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-2">Student: Slim Gharbi</h2>
          <p className="text-lg text-gray-700">Duration: 18 Hours | October 14 - November 8, 2025</p>
          <p className="text-md text-gray-600 mt-2">Preparing for USA Transition</p>
        </div>

        {/* Search Bar and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search sessions, objectives, content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 rounded-lg shadow-lg border-2 border-indigo-200 focus:outline-none focus:border-indigo-500"
            />
            <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-indigo-500" />
          </div>
          <div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="p-4 rounded-lg shadow-lg border-2 border-indigo-200 focus:outline-none focus:border-indigo-500 w-full sm:w-auto"
            >
              {filterOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Display message if no results */}
        {filteredSessions.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            No results found for "{searchQuery}". Try a different search term or filter.
          </div>
        ) : (
          <Carousel
            key={filteredSessions.length}
            showArrows={true}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={shouldAutoPlay}
            interval={6000}
            stopOnHover={true}
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  onClick={onClickHandler}
                  title={label}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors z-10 shadow-lg"
                >
                  <FaChevronLeft />
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  onClick={onClickHandler}
                  title={label}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors z-10 shadow-lg"
                >
                  <FaChevronRight />
                </button>
              )
            }
          >
            {filteredSessions.map((session, index) => (
              <motion.div
                key={`${session.week}-${session.session}-${index}`}
                className="p-8 bg-white rounded-xl shadow-2xl mx-4 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                {/* Session Header */}
                <div className="mb-6 border-b-2 border-indigo-100 pb-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                    <h2 className="text-3xl font-bold text-indigo-700">
                      {session.session}
                    </h2>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <span className="inline-block bg-teal-100 text-teal-800 text-sm font-semibold px-4 py-1 rounded-full">
                        {session.week}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-purple-600 mb-2">
                    {session.theme}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-indigo-500" />
                      <span className="text-sm">{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-indigo-500" />
                      <span className="text-sm">{session.time}</span>
                    </div>
                  </div>
                </div>

                {/* Session Content */}
                <div className="space-y-6">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h4 className="text-lg font-bold text-indigo-700 mb-3 flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      Session Objective
                    </h4>
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {session.objective}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                      <span className="text-2xl">📋</span>
                      Content & Activities
                    </h4>
                    <p className="text-gray-800 leading-relaxed">
                      {session.content}
                    </p>
                  </div>
                </div>

                {/* Session Methodology Note */}
                {index === 0 && (
                  <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h5 className="font-semibold text-yellow-800 mb-2">📝 Session Structure (90 minutes)</h5>
                    <ul className="text-sm text-yellow-900 space-y-1">
                      <li>• Warm-up (10 min): Review & conversational practice</li>
                      <li>• Core Learning (50 min): Interactive activities & role-plays</li>
                      <li>• Real-World Application (20 min): USA situation scenarios</li>
                      <li>• Wrap-up (10 min): Self-assessment & preview</li>
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default EFLCurriculumCarousel;
