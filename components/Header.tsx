import React from 'react';
import { ChefHatIcon } from './Icons';

interface HeaderProps {
    user: string | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
            <ChefHatIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="ml-3 text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              AI Recipe Idea Generator
            </h1>
        </div>
        {user && (
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">{user}</span>
                <button 
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-700 transition-colors"
                >
                    Logout
                </button>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;