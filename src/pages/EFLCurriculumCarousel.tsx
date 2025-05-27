// src/pages/EFLCurriculumCarousel.tsx
import React, { useState, useMemo } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { motion } from 'framer-motion';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const courseSchedule = [
  {
    month: 'Month 1',
    weeks: [
      {
        week: 'Week 1',
        lessons: [
          {
            unit: 'Hello!',
            objectives: 'Learn greetings and introductions; use "am/are/is".',
            grammar: 'am/are/is, my/your, What’s your name?, This is ..., Nice to meet you.',
            vocabulary: 'How are you?, Numbers 1-20, Countries',
            tasks: 'Practice greetings (sp_01-01); Vocabulary flashcards (vo_01-01).',
            quizId: 'sp_01-01',
            flashcardId: 'vo_01-01',
            everydayEnglish: 'Good morning!, See you later!',
          },
          {
            unit: 'Hello!',
            objectives: 'Ask and answer simple questions; introduce others.',
            grammar: 'What’s your name?, This is ...',
            vocabulary: 'Nice to meet you, Very well, thank you.',
            tasks: 'Roleplay introductions; Quiz on greetings (vo_01-02).',
            quizId: 'vo_01-02',
            everydayEnglish: 'Have a nice day., Goodbye!',
          },
        ],
      },
      {
        week: 'Week 2',
        lessons: [
          {
            unit: 'Your world',
            objectives: 'Talk about countries and people; use "he/she/they".',
            grammar: 'he/she/they, he/her, He’s from the United States.',
            vocabulary: 'Countries (Brazil, China), Adjectives (beautiful)',
            tasks: 'Reading about people (re_01-01); Vocabulary quiz (vo_01-02).',
            quizId: 're_01-01',
            everydayEnglish: 'fifteen, twenty-one',
          },
          {
            unit: 'Your world',
            objectives: 'Ask questions about people; describe places.',
            grammar: 'Questions: What’s his name?, Where’s she from?',
            vocabulary: 'Nouns: centre, hospital, park',
            tasks: 'Speaking practice; Flashcards for places (vo_01-03).',
            flashcardId: 'vo_01-03',
            everydayEnglish: 'fifteen, twenty-one',
          },
        ],
      },
      {
        week: 'Week 3',
        lessons: [
          {
            unit: 'All about you',
            objectives: 'Describe jobs and personal information; use "am/are/is".',
            grammar: 'am/are/is, We’re all singers., She isn’t a nurse.',
            vocabulary: 'Jobs (police officer, nurse), Personal information',
            tasks: 'Reading quiz (re_01-01); Grammar quiz (gr_01-01).',
            quizId: 're_01-01',
            secondaryQuizId: 'gr_01-01',
            everydayEnglish: 'I’m sorry., Excuse me!',
          },
          {
            unit: 'All about you',
            objectives: 'Ask yes/no questions; give short answers.',
            grammar: 'Questions: Is she married?, Short answers: Yes, she is.',
            vocabulary: 'surname, address, phone number',
            tasks: 'Grammar flashcards (gr_01-04); Yes/no quiz (gr_01-03).',
            quizId: 'gr_01-03',
            flashcardId: 'gr_01-04',
            everydayEnglish: 'I don’t understand.',
          },
        ],
      },
      {
        week: 'Week 4',
        lessons: [
          {
            unit: 'Family and friends',
            objectives: 'Talk about family; use possessive adjectives.',
            grammar: 'Possessive adjectives: her, their, Anna’s husband',
            vocabulary: 'The family: son, wife, very beautiful',
            tasks: 'Writing practice (wr_01-01); Reading about friends.',
            quizId: 'wr_01-01',
            everydayEnglish: 'How do you spell ...?, On the phone',
          },
          {
            unit: 'The way I live',
            objectives: 'Describe daily activities; use Present Simple.',
            grammar: 'Present Simple: I/you/he, Like ice-cream?',
            vocabulary: 'Sports (tennis), Food (hamburger), Languages',
            tasks: 'Listening quiz (li_01-01); Vocabulary flashcards (vo_01-03).',
            quizId: 'li_01-01',
            flashcardId: 'vo_01-03',
            everydayEnglish: 'How much is it?, £6.50',
          },
        ],
      },
    ],
  },
  {
    month: 'Month 2',
    weeks: [
      {
        week: 'Week 1',
        lessons: [
          {
            unit: 'Every day',
            objectives: 'Talk about routines; use Present Simple for "he/she".',
            grammar: 'Present Simple: He gets up at 6.00., Adverbs: always, often',
            vocabulary: 'The time: nine o’clock, Verbs: get home, Nouns: coffee',
            tasks: 'Speaking lifestyle questions; Grammar quiz (gr_01-01).',
            quizId: 'gr_01-01',
            everydayEnglish: 'Days of the week, on Sunday',
          },
          {
            unit: 'Every day',
            objectives: 'Tell time; use prepositions of time.',
            grammar: 'What time does he have breakfast?',
            vocabulary: 'It’s ten fifteen., toast, beach',
            tasks: 'Vocabulary flashcards (vo_01-04); Roleplay telling time.',
            flashcardId: 'vo_01-04',
            everydayEnglish: 'at nine o’clock, in the morning',
          },
        ],
      },
      {
        week: 'Week 2',
        lessons: [
          {
            unit: 'My favourites',
            objectives: 'Describe preferences; use question words.',
            grammar: 'Question words: who, what, this/that',
            vocabulary: 'Adjectives: comfortable, friendly, Places: chemist',
            tasks: 'Writing a postcard; Reading quiz (re_01-02).',
            quizId: 're_01-02',
            everydayEnglish: 'Can I have a return ticket?',
          },
          {
            unit: 'My favourites',
            objectives: 'Use opposite adjectives; talk about places.',
            grammar: 'Pronouns: subject/Object, these/those',
            vocabulary: 'Opposite adjectives: new/old, big/small',
            tasks: 'Vocabulary flashcards (vo_01-03); Speaking practice.',
            flashcardId: 'vo_01-03',
            everydayEnglish: 'Can I try on this jumper, please?',
          },
        ],
      },
      {
        week: 'Week 3',
        lessons: [
          {
            unit: 'Where I live',
            objectives: 'Describe places; use "There is/are".',
            grammar: 'There is/are ... old offices, Are there any animals?',
            vocabulary: 'Rooms: living room, bedroom, In town: post office',
            tasks: 'Reading about cities; Writing quiz (wr_01-01).',
            quizId: 'wr_01-01',
            everydayEnglish: 'Turn left ..., Go straight on ...',
          },
          {
            unit: 'Where I live',
            objectives: 'Use prepositions; describe locations.',
            grammar: 'Prepositions: in, on, under, next to',
            vocabulary: 'furniture: sofa, beach, ferry',
            tasks: 'Vocabulary flashcards (vo_01-04); Speaking directions.',
            flashcardId: 'vo_01-04',
            everydayEnglish: 'Is there a ... near here?',
          },
        ],
      },
      {
        week: 'Week 4',
        lessons: [
          {
            unit: 'Times past',
            objectives: 'Talk about the past; use "was/were".',
            grammar: 'was/were born, I was born in 1996.',
            vocabulary: 'Years: 2002, 1996, People: singer, artist',
            tasks: 'Listening quiz (li_01-01); Reading about history.',
            quizId: 'li_01-01',
            everydayEnglish: 'What’s your birthday?, January',
          },
          {
            unit: 'We had a great time!',
            objectives: 'Use Past Simple; describe past activities.',
            grammar: 'Past Simple: Played, got, What did you do?',
            vocabulary: 'Weekend activities: go to the cinema, Sports: skiing',
            tasks: 'Writing a postcard; Reading quiz (re_01-02).',
            quizId: 're_01-02',
            everydayEnglish: 'Really? Oh! Good!',
          },
        ],
      },
    ],
  },
  {
    month: 'Month 3',
    weeks: [
      {
        week: 'Week 1',
        lessons: [
          {
            unit: 'I can do that!',
            objectives: 'Talk about abilities; use "can/can’t".',
            grammar: 'can’t, Mr can speak French., Can she run fast?',
            vocabulary: 'Verbs: run, drive, Adjectives: fast, dangerous',
            tasks: 'Reading about the Internet; Grammar quiz (gr_01-03).',
            quizId: 'gr_01-03',
            everydayEnglish: 'I’m lost!, Turn everything off.',
          },
          {
            unit: 'I can do that!',
            objectives: 'Make requests; use adverbs.',
            grammar: 'Adverbs: really well, quietly, Can I help you?',
            vocabulary: 'Verb + noun: listen to the radio, chat to friends',
            tasks: 'Speaking roleplay; Flashcards (vo_01-03).',
            flashcardId: 'vo_01-03',
            everydayEnglish: 'This machine doesn’t work!',
          },
        ],
      },
      {
        week: 'Week 2',
        lessons: [
          {
            unit: 'Please and thank you',
            objectives: 'Shop for items; use "I’d like ...".',
            grammar: 'I’d like ..., some and any, Do you have any bread?',
            vocabulary: 'Shopping: bread, milk, In a restaurant: soup, salad',
            tasks: 'Listening quiz (li_01-01); Roleplay ordering food.',
            quizId: 'li_01-01',
            everydayEnglish: 'Would you like a drink?',
          },
          {
            unit: 'Please and thank you',
            objectives: 'Order in a restaurant; use "like/would like".',
            grammar: 'like and would like, I like Coke.',
            vocabulary: 'food: cereal, pasta, fish',
            tasks: 'Speaking practice; Vocabulary flashcards (vo_01-04).',
            flashcardId: 'vo_01-04',
            everydayEnglish: 'What would you like to watch the football?',
          },
        ],
      },
      {
        week: 'Week 3',
        lessons: [
          {
            unit: 'Here and now',
            objectives: 'Describe current actions; use Present Continuous.',
            grammar: 'Present Continuous, What’s he doing?',
            vocabulary: 'Colours: red, green, Clothes: jacket, trousers',
            tasks: 'Reading quiz (re_01-02); Speaking conversations.',
            quizId: 're_01-02',
            everydayEnglish: 'What’s the matter?, She has a headache.',
          },
          {
            unit: 'Here and now',
            objectives: 'Compare Present Simple and Continuous.',
            grammar: 'Present Simple and Present Continuous',
            vocabulary: 'Opposite verbs: buy/sell, hate/love',
            tasks: 'Grammar flashcards (gr_01-04); Grammar quiz (gr_01-01).',
            quizId: 'gr_01-01',
            flashcardId: 'gr_01-04',
            everydayEnglish: 'Why don’t you ...?, That’s a good idea.',
          },
        ],
      },
      {
        week: 'Week 4',
        lessons: [
          {
            unit: 'It’s time to go!',
            objectives: 'Talk about future plans; use "going to".',
            grammar: 'Future plans: I’m leaving on Tuesday.',
            vocabulary: 'Transport: bus, plane, Words: train station',
            tasks: 'Writing a postcard; Reading quiz (re_01-01).',
            quizId: 're_01-01',
            everydayEnglish: 'Don’t worry!, It doesn’t matter!',
          },
          {
            unit: 'Review',
            objectives: 'Review key grammar and vocabulary; assess progress.',
            grammar: 'Mix of am/are/is, Present Simple, Past Simple, can',
            vocabulary: 'Greetings, jobs, daily routines, shopping',
            tasks: 'Mixed quiz (gr_01-03); Speaking roleplay (sp_01-01).',
            quizId: 'gr_01-03',
            secondaryQuizId: 'sp_01-01',
            everydayEnglish: 'Thanks for everything!, It was a pleasure.',
          },
        ],
      },
    ],
  },
];

const EFLCurriculumCarousel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Flatten lessons for filtering
  const allLessons = useMemo(() => {
    return courseSchedule.flatMap(month =>
      month.weeks.flatMap(week =>
        week.lessons.map(lesson => ({
          ...lesson,
          month: month.month,
          week: week.week,
        }))
      )
    );
  }, []);

  // Filter lessons based on search query and selected filter
  const filteredLessons = useMemo(() => {
    let lessons = allLessons;

    // Apply month/week filter
    if (selectedFilter !== 'All') {
      if (selectedFilter.includes('Month')) {
        lessons = lessons.filter(lesson => lesson.month === selectedFilter);
      } else {
        lessons = lessons.filter(lesson => lesson.week === selectedFilter);
      }
    }

    // Apply search query
    if (searchQuery) {
      lessons = lessons.filter(lesson =>
        lesson.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.objectives.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.grammar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.vocabulary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.tasks.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.everydayEnglish.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return lessons;
  }, [searchQuery, selectedFilter, allLessons]);

  // Options for filter dropdown
  const filterOptions = [
    'All',
    ...courseSchedule.map(month => month.month),
    ...courseSchedule.flatMap(month => month.weeks.map(week => week.week)),
  ];

  // Disable autoPlay when searching or filtering
  const shouldAutoPlay = searchQuery.length === 0 && selectedFilter === 'All';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-800 mb-6 text-center">EFL Course Schedule</h1>

        {/* Search Bar and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search lessons, grammar, vocabulary..."
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
        {filteredLessons.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            No results found for "{searchQuery}". Try a different search term or filter.
          </div>
        ) : (
          <Carousel
            key={filteredLessons.length}
            showArrows={true}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={shouldAutoPlay}
            interval={5000}
            stopOnHover={true}
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  onClick={onClickHandler}
                  title={label}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors z-10"
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors z-10"
                >
                  <FaChevronRight />
                </button>
              )
            }
          >
            {filteredLessons.map((lesson, index) => (
              <motion.div
                key={`${lesson.month}-${lesson.week}-${index}`}
                className="p-6 bg-white rounded-lg shadow-xl mx-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-4">
                  <span className="text-indigo-600">{lesson.month}</span> | <span className="text-teal-600">{lesson.week}</span> | <span className="text-purple-600">Lesson {index + 1} : {lesson.unit}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-indigo-600 mb-2">Objectives</h3>
                    <p className="text-gray-700">{lesson.objectives}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-indigo-600 mb-2">Grammar</h3>
                    <p className="text-gray-700">{lesson.grammar}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-indigo-600 mb-2">Vocabulary</h3>
                    <p className="text-gray-700">{lesson.vocabulary}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-indigo-600 mb-2">Tasks</h3>
                    <p className="text-gray-700">{lesson.tasks}</p>
                    <div className="flex gap-2 mt-2">
                      {lesson.quizId && (
                        <Link
                          to={`/quiz/${lesson.quizId}`}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          Take Quiz
                        </Link>
                      )}
                      {lesson.flashcardId && (
                        <Link
                          to={`/quiz/${lesson.flashcardId}`}
                          className="text-sm text-green-600 hover:underline"
                        >
                          Flashcards
                        </Link>
                      )}
                      {lesson.secondaryQuizId && (
                        <Link
                          to={`/quiz/${lesson.secondaryQuizId}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Extra Quiz
                        </Link>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-indigo-600 mb-2">Everyday English</h3>
                    <p className="text-gray-700">{lesson.everydayEnglish}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default EFLCurriculumCarousel;