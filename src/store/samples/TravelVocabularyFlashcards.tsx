import React, { useState } from 'react';
import { 
  Plane, 
  Map, 
  Compass, 
  Camera, 
  Briefcase, 
  Globe, 
  Car, 
  Hotel,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Book,
  Tag,
  FileText
} from 'lucide-react';

const TravelVocabularyFlashcards = () => {
  const travelItems = [
    { id: 'plane', name: 'Plane', icon: <Plane size={64} />, description: 'A vehicle that flies for long-distance travel.' },
    { id: 'car', name: 'Car', icon: <Car size={64} />, description: 'A road vehicle for personal transport.' },
    { id: 'ticket', name: 'Ticket', icon: <Tag size={64} />, description: 'A pass for using transport or entering a place.' },
    { id: 'map', name: 'Map', icon: <Map size={64} />, description: 'A diagram showing geographic locations.' },
    { id: 'compass', name: 'Compass', icon: <Compass size={64} />, description: 'A tool for finding direction.' },
    { id: 'globe', name: 'Globe', icon: <Globe size={64} />, description: 'A spherical model of Earth for planning routes.' },
    { id: 'guidebook', name: 'Guidebook', icon: <Book size={64} className="text-blue-600" />, description: 'A book with travel information.' },
    { id: 'suitcase', name: 'Suitcase', icon: <Briefcase size={64} />, description: 'A bag for carrying clothes and items.' },
    { id: 'camera', name: 'Camera', icon: <Camera size={64} />, description: 'A device for capturing travel memories.' },
    { id: 'passport', name: 'Passport', icon: <FileText size={64} className="text-red-600" />, description: 'A document for international travel.' },
    { id: 'hotel', name: 'Hotel', icon: <Hotel size={64} />, description: 'A place to stay during travel.' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentItem = travelItems[currentIndex];

  // TTS Function
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Navigation
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % travelItems.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + travelItems.length) % travelItems.length);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-blue-700 text-white p-6 text-center">
        <h1 className="text-3xl font-bold">Travel Vocabulary Flashcards</h1>
        <p className="text-base mt-1">Memorize travel items and their uses</p>
      </div>

      {/* Flashcard */}
      <div className="p-8">
        <div
          className="relative w-full h-[28rem] bg-gray-100 rounded-xl shadow-lg cursor-pointer transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front Side: Definition, Role, Icon */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-blue-600 mb-6">
              {currentItem.icon}
            </div>
            <p className="text-lg text-gray-800 text-center mb-6 font-medium">{currentItem.description}</p>
            <div className="w-full">
              <h3 className="text-base font-semibold text-gray-900 border-b-2 border-gray-200 pb-2 mb-3">Examples:</h3>
              <ul className="list-disc pl-6 text-base text-gray-700 space-y-3">
                {[
                  `The traveler used this item to plan the trip.`,
                  `Always ensure this item is ready before departure.`,
                  `This item enhances the travel experience.`
                ].map((sentence, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span>{sentence}</span>
                    <button
                      className="text-gray-600 hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(sentence);
                      }}
                    >
                      <Volume2 size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Back Side: Item Name */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-900">{currentItem.name}</span>
              <button
                className="text-gray-600 hover:text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(currentItem.name);
                }}
              >
                <Volume2 size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            className="p-3 text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
            onClick={prevCard}
          >
            <ChevronLeft size={32} />
          </button>
          <span className="text-lg text-gray-700 font-medium">
            {currentIndex + 1} / {travelItems.length}
          </span>
          <button
            className="p-3 text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
            onClick={nextCard}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 p-6 border-t text-center">
        <p className="text-base text-gray-700">
          Click the card to flip (front: definition + icon, back: name), use arrows to navigate, and the speaker icon for British English pronunciation.
        </p>
      </div>
    </div>
  );
};

export default TravelVocabularyFlashcards;
