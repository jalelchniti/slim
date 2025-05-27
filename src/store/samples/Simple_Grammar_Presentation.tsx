import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Introduction to Simple Present",
    content: "The Simple Present tense is used to describe habits, general truths, routines, and facts that are always or generally true.",
    example: "The sun rises in the east.",
  },
  {
    title: "1. Habits and Routines",
    content: "Use Simple Present for actions that happen regularly or consistently.",
    example: "She walks to school every day.",
  },
  {
    title: "2. General Truths and Facts",
    content: "It describes things that are universally true or scientifically accurate.",
    example: "Water boils at 100°C.",
  },
  {
    title: "3. Scheduled Events",
    content: "Use it for events on a timetable or schedule, like transportation or classes.",
    example: "The train leaves at 6 PM.",
  },
  {
    title: "4. Feelings, Opinions, and States",
    content: "It expresses emotions, beliefs, or permanent states (often with verbs like 'like,' 'know,' 'belong').",
    example: "He likes chocolate.",
  },
  {
    title: "5. Instructions and Directions",
    content: "Simple Present is used for giving step-by-step guidance.",
    example: "You turn left at the corner.",
  },
  {
    title: "Summary of Simple Present Uses",
    content: (
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="p-3 font-semibold">Use</th>
            <th className="p-3 font-semibold">Description</th>
            <th className="p-3 font-semibold">Example</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-indigo-50">
            <td className="p-3 border-t border-indigo-200">Habits and Routines</td>
            <td className="p-3 border-t border-indigo-200">Regular or consistent actions</td>
            <td className="p-3 border-t border-indigo-200 italic">She walks to school every day.</td>
          </tr>
          <tr className="bg-white">
            <td className="p-3 border-t border-indigo-200">General Truths</td>
            <td className="p-3 border-t border-indigo-200">Universal or scientific facts</td>
            <td className="p-3 border-t border-indigo-200 italic">Water boils at 100°C.</td>
          </tr>
          <tr className="bg-indigo-50">
            <td className="p-3 border-t border-indigo-200">Scheduled Events</td>
            <td className="p-3 border-t border-indigo-200">Timetables or schedules</td>
            <td className="p-3 border-t border-indigo-200 italic">The train leaves at 6 PM.</td>
          </tr>
          <tr className="bg-white">
            <td className="p-3 border-t border-indigo-200">Feelings and States</td>
            <td className="p-3 border-t border-indigo-200">Emotions, beliefs, states</td>
            <td className="p-3 border-t border-indigo-200 italic">He likes chocolate.</td>
          </tr>
          <tr className="bg-indigo-50">
            <td className="p-3 border-t border-indigo-200">Instructions</td>
            <td className="p-3 border-t border-indigo-200">Step-by-step guidance</td>
            <td className="p-3 border-t border-indigo-200 italic">You turn left at the corner.</td>
          </tr>
        </tbody>
      </table>
    ),
    example: null,
  },
];

const SimpleGrammarPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const viewFlashcards = () => navigate("/quiz/u1-gr-flashcard-11");

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8 min-h-[400px] flex flex-col justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">{slides[currentSlide].title}</h2>
          {typeof slides[currentSlide].content === "string" ? (
            <p className="text-gray-700 text-lg leading-relaxed mb-6">{slides[currentSlide].content}</p>
          ) : (
            <div className="mb-6">{slides[currentSlide].content}</div>
          )}
          {slides[currentSlide].example && (
            <div className="bg-indigo-50 p-4 rounded-md">
              <p className="text-indigo-800 font-semibold italic">Example: "{slides[currentSlide].example}"</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center mt-6 space-y-4">
          <div className="flex justify-between items-center w-full">
            <span className="text-gray-500 text-sm">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <div className="space-x-4">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-400 transition-colors duration-300"
              >
                Previous
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-400 transition-colors duration-300"
              >
                Next
              </button>
            </div>
          </div>
          {currentSlide === slides.length - 1 && (
            <button
              onClick={viewFlashcards}
              className="px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors duration-300"
            >
              View the Flashcards
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SimpleGrammarPresentation;
