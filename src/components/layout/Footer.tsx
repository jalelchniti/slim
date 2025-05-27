const Footer = () => {
    return (
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-primary-600 text-lg font-bold font-serif">EnglishMaster</span>
              <p className="text-gray-500 text-sm mt-1">Master the English language effectively.</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                About
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Contact
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} BeSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer