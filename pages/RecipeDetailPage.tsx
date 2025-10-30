import React from 'react';
import { type Recipe } from '../types';
import { ArrowLeftIcon, ClockIcon } from '../components/Icons';

interface RecipeDetailPageProps {
  recipe: Recipe;
  onBack: () => void;
}

const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({ recipe, onBack }) => {
  const hasImage = recipe.imageUrl && recipe.imageUrl !== 'loading' && recipe.imageUrl !== 'error';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to recipes
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {hasImage && (
            <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-64 md:h-96 object-cover" />
          )}
          <div className="p-6 md:p-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{recipe.name}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{recipe.description}</p>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-md text-gray-600 dark:text-gray-300 mb-8 border-y dark:border-gray-700 py-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                <span><strong>Prep:</strong> {recipe.prepTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                <span><strong>Cook:</strong> {recipe.cookTime}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="md:col-span-1">
                <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200 mb-4">Ingredients</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {recipe.ingredients.map((item, index) => (
                    <li key={index} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2">
                <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200 mb-4">Instructions</h2>
                <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
                  {recipe.instructions.map((item, index) => (
                    <li key={index} className="leading-relaxed pl-2">{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeDetailPage;
