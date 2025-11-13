
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Career Path Finder. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;