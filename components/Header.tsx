
import React from 'react';
import { CareerIcon } from './IconComponents';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <CareerIcon className="h-8 w-8 text-sky-400" />
          <h1 className="text-2xl font-bold text-gray-100">Career Path Finder</h1>
        </div>
        {isLoggedIn && (
          <button
            onClick={onLogout}
            className="bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500"
          >
            Log Out
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;