import React from 'react';
import { SearchIcon } from './Icons';

interface RecipeControlsProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    prepTimeFilter: string;
    onPrepTimeChange: (value: string) => void;
}

const RecipeControls: React.FC<RecipeControlsProps> = ({
    searchTerm,
    onSearchChange,
    prepTimeFilter,
    onPrepTimeChange,
}) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search recipes by name or ingredient..."
                className="w-full px-4 py-3 pl-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
            />
        </div>
        <div className="w-full sm:w-auto">
            <select
                value={prepTimeFilter}
                onChange={e => onPrepTimeChange(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 appearance-none"
            >
                <option value="all">All Prep Times</option>
                <option value="15">Under 15 mins</option>
                <option value="30">Under 30 mins</option>
                <option value="60">Under 1 hour</option>
            </select>
        </div>
    </div>
  );
};

export default RecipeControls;
