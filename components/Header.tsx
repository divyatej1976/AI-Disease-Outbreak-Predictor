
import React from 'react';
import { Brain } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 pt-4 sm:pt-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Disease Outbreak Predictor
        </h1>
      </div>
      <p className="text-slate-300 text-md sm:text-lg max-w-3xl mx-auto">
        An interactive dashboard simulating epidemic risk using Cloud AI and Big Data principles.
      </p>
    </header>
  );
};

export default Header;