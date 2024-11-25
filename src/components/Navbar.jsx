import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onGetStarted }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex flex-col items-start ml-4 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <img src="/brand_logo.svg" alt="Swipe Logo" className="h-8 w-auto" />
              <span className="text-xs text-gray-600">AI-Powered Invoice Management</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav>
              <ul className="flex space-x-8">
                <li><a href="#templates" className="text-gray-700 hover:text-indigo-600">Templates</a></li>
                <li><a href="#pricing" className="text-gray-700 hover:text-indigo-600">Pricing</a></li>
                <li><a href="#faqs" className="text-gray-700 hover:text-indigo-600">FAQs</a></li>
                <li><a href="#contact" className="text-gray-700 hover:text-indigo-600">Contact us</a></li>
              </ul>
            </nav>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className={`${isOpen ? 'block' : 'hidden'} md:hidden`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
        transition={{ duration: 0.2 }}
      >
        <nav>
          <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <li><a href="#templates" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Templates</a></li>
            <li><a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Pricing</a></li>
            <li><a href="#faqs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">FAQs</a></li>
            <li><a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Contact us</a></li>
          </ul>
        </nav>
        <button
          onClick={onGetStarted}
          className="block w-full px-4 py-2 text-center font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          Get Started
        </button>
      </motion.div>
    </nav>
  );
}