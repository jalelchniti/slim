// src/components/layout/Sidebar.tsx
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  closeSidebar: () => void
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        closeSidebar()
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, closeSidebar])

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isOpen && !target.closest('.sidebar') && !target.closest('button[aria-label="Toggle sidebar"]')) {
        closeSidebar()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closeSidebar])

  return (
    <AnimatePresence>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        className={`sidebar fixed md:relative inset-y-0 left-0 w-64 bg-white shadow-lg z-30 md:translate-x-0 md:shadow-none transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
        animate={{ x: isOpen ? 0 : '-100%' }}
        initial={false}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header for mobile */}
          <div className="md:hidden p-4 border-b border-gray-200 flex justify-between items-center">
            <Link to="/" onClick={closeSidebar} className="flex items-center gap-2">
              <img
                src="/slim/assets/images/lnkd_profile_picture-01.jpg"
                alt="SmartHub Tunis Logo"
                className="h-10 w-10 rounded-full object-cover shadow-md border-2 border-orange-400"
              />
              <span className="text-lg font-semibold text-primary-600">SmartHub Tunis</span>
            </Link>
            <button
              onClick={closeSidebar}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Sidebar content */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Learn</p>
            <Link to="/vocabulary" onClick={closeSidebar} className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
              Vocabulary
            </Link>
            <Link to="/grammar" onClick={closeSidebar} className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
              Grammar
            </Link>
            <Link to="/speaking" onClick={closeSidebar} className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
              Speaking
            </Link>
            <Link to="/reading" onClick={closeSidebar} className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
              Reading
            </Link>
            <Link to="/listening" onClick={closeSidebar} className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
              Listening
            </Link>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Coaching</p>
              <Link to="/companion" onClick={closeSidebar} className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
                My Companion
              </Link>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Practice</p>
              <Link to="/quiz/vocabulary" onClick={closeSidebar} className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
                Vocabulary Quiz
              </Link>
              <Link to="/quiz/a1-vocab-flashcards-01" onClick={closeSidebar} className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
                A1 Greetings & Numbers Flashcards
              </Link>
              <Link to="/quiz/grammar" onClick={closeSidebar} className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
                Grammar Quiz
              </Link>
              <Link to="/quiz/listening" onClick={closeSidebar} className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
                Listening Quiz
              </Link>
            </div>
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm">
                <a href="#" className="text-primary-600 hover:text-primary-800 font-medium">Need help?</a>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}

export default Sidebar