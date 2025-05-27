import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <button
              className="md:hidden mr-2 p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center">
              <span className="text-primary-600 text-2xl font-bold font-serif">
                BeSmart Ezzahra
              </span>
            </div>
          </div>

          {/* Navigation for larger screens */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium"
            >
              Home
            </Link>
            <Link
              to="/vocabulary"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium"
            >
              Vocabulary
            </Link>
            <Link
              to="/grammar"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium"
            >
              Grammar
            </Link>
            <Link
              to="/speaking"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium"
            >
              Speaking
            </Link>
            <Link
              to="/reading"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium"
            >
              Reading
            </Link>
            <Link
              to="/listening"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium"
            >
              Listening
            </Link>
            <Link
              to="/writing"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium"
            >
              Writing
            </Link>
            <Link
              to="/evaluation"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium"
            >
              Evaluation
            </Link>
          </nav>

          {/* Profile dropdown */}
          <div className="flex items-center">
            <Link
              to="/curriculum"
              className="bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2 rounded-md font-medium"
            >
              Curriculum
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;