import React from 'react';
import { type Recipe } from '../types';
import { BookmarkIcon, TrashIcon, CheckCircleIcon, ClockIcon, PhotoIcon } from './Icons';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onSave?: () => void;
  onRemove?: () => void;
  isSaved: boolean;
}

const ImagePlaceholder: React.FC<{ status: 'loading' | 'error' | 'empty' }> = ({ status }) => (
    <div className="w-full h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
        {status === 'loading' && (
            <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        )}
        {(status === 'error' || status === 'empty') && <PhotoIcon className="w-12 h-12 text-gray-400" />}
    </div>
);

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect, onSave, onRemove, isSaved }) => {

  return (
    <div 
      onClick={() => onSelect(recipe)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      
      {recipe.imageUrl === 'loading' ? (
          <ImagePlaceholder status="loading" />
      ) : recipe.imageUrl === 'error' ? (
          <ImagePlaceholder status="error" />
      ) : recipe.imageUrl ? (
        <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-48 object-cover" />
      ) : (
        <ImagePlaceholder status="empty" />
      )}

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex-1 pr-2">{recipe.name}</h3>
          {onSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onSave) onSave();
              }}
              disabled={isSaved}
              className={`p-2 rounded-full transition-colors duration-200 ${isSaved ? 'text-green-500' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-500'}`}
              aria-label={isSaved ? "Saved" : "Save Recipe"}
            >
              {isSaved ? <CheckCircleIcon className="w-6 h-6" /> : <BookmarkIcon className="w-6 h-6" />}
            </button>
          )}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onRemove) onRemove();
              }}
              className="p-2 rounded-full text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-500 transition-colors duration-200"
              aria-label="Remove Recipe"
            >
              <TrashIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{recipe.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4"/>
                <span>Prep: {recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4"/>
                <span>Cook: {recipe.cookTime}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
