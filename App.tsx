
import React, { useState } from 'react';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check localStorage for persisted login state
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoggedIn ? <Dashboard /> : <SignIn onLogin={handleLogin} />}
      </main>
      <Footer />
    </div>
  );
};

export default App;