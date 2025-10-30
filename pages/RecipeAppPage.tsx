import React, { useState } from 'react';
import { useRecipeStore } from '../hooks/useRecipeStore';
import { type Recipe } from '../types';

import Header from '../components/Header';
import Spinner from '../components/Spinner';
import RecipeGrid from '../components/RecipeGrid';
import RecipeControls from '../components/RecipeControls';
import EmptyState from '../components/EmptyState';
import AddRecipeModal from '../components/AddRecipeModal';
import RecipeDetailPage from './RecipeDetailPage';
import { BookmarkIcon, SparklesIcon, BookOpenIcon, PlusIcon, UserIcon } from '../components/Icons';

type Tab = 'explore' | 'saved' | 'my-recipes';

interface RecipeAppPageProps {
  user: string;
  onLogout: () => void;
}

export default function RecipeAppPage({ user, onLogout }: RecipeAppPageProps) {
  const [ingredient, setIngredient] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('explore');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const {
    state,
    generate,
    saveRecipe,
    removeRecipe,
    addMyRecipe,
    removeMyRecipe,
    isRecipeSaved,
    setSearchTerm,
    setPrepTimeFilter,
  } = useRecipeStore(user);

  const {
    generatedRecipes,
    savedRecipes,
    myRecipes,
    filteredGeneratedRecipes,
    filteredSavedRecipes,
    filteredMyRecipes,
    isLoading,
    error,
    searchTerm,
    prepTimeFilter,
  } = state;

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ingredient.trim() || isLoading) return;
    setActiveTab('explore');
    generate(ingredient);
  };
  
  const changeTab = (tab: Tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setPrepTimeFilter('all');
  };

  const renderContent = () => {
    let recipesToShow, onRemoveHandler, onSaveHandler, originalListLength;
    let emptyState: React.ReactNode | null = null;
    
    switch (activeTab) {
        case 'explore':
            recipesToShow = filteredGeneratedRecipes;
            onSaveHandler = saveRecipe;
            originalListLength = generatedRecipes.length;
            if (generatedRecipes.length === 0) {
                 emptyState = <EmptyState Icon={BookOpenIcon} title="Ready to Cook?" message="Enter an ingredient above to discover new recipes." />;
            }
            break;
        case 'saved':
            recipesToShow = filteredSavedRecipes;
            onRemoveHandler = removeRecipe;
            originalListLength = savedRecipes.length;
            if (savedRecipes.length === 0) {
                emptyState = <EmptyState Icon={BookmarkIcon} title="No Saved Recipes Yet" message="Explore recipes and save your favorites to see them here." />;
            }
            break;
        case 'my-recipes':
            recipesToShow = filteredMyRecipes;
            onRemoveHandler = removeMyRecipe;
            originalListLength = myRecipes.length;
            if (myRecipes.length === 0) {
                 emptyState = <EmptyState Icon={UserIcon} title="Your Personal Recipe Book is Empty" message="Click 'Add New Recipe' to start creating your own collection." />;
            }
            break;
    }
      
    if (emptyState) return emptyState;

    return (
        <>
            <RecipeControls 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              prepTimeFilter={prepTimeFilter}
              onPrepTimeChange={setPrepTimeFilter}
            />
            <RecipeGrid 
              recipes={recipesToShow}
              onSelectRecipe={setSelectedRecipe}
              onSave={onSaveHandler}
              onRemove={onRemoveHandler}
              isRecipeSaved={isRecipeSaved}
              originalListLength={originalListLength}
            />
        </>
    );
  };

  if (selectedRecipe) {
    return <RecipeDetailPage recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header user={user} onLogout={onLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 mb-8">
            <button
              onClick={() => changeTab('explore')}
              className={`flex items-center gap-2 px-4 py-3 text-lg font-medium transition-colors duration-200 ${activeTab === 'explore' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <SparklesIcon className="w-5 h-5" /> Explore
            </button>
            <button
              onClick={() => changeTab('saved')}
              className={`flex items-center gap-2 px-4 py-3 text-lg font-medium transition-colors duration-200 ${activeTab === 'saved' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <BookmarkIcon className="w-5 h-5" /> Saved ({savedRecipes.length})
            </button>
            <button
              onClick={() => changeTab('my-recipes')}
              className={`flex items-center gap-2 px-4 py-3 text-lg font-medium transition-colors duration-200 ${activeTab === 'my-recipes' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <UserIcon className="w-5 h-5" /> My Recipes ({myRecipes.length})
            </button>
          </div>

          {activeTab === 'explore' && (
            <div className="mb-12 max-w-3xl mx-auto">
              <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={ingredient}
                  onChange={e => setIngredient(e.target.value)}
                  placeholder="Enter an ingredient (e.g., chicken, tofu)"
                  className="flex-grow w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !ingredient.trim()}
                  className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed dark:disabled:bg-indigo-800 transition-all duration-200 shadow-sm"
                >
                  {isLoading ? <Spinner className="text-white" /> : <><SparklesIcon className="w-5 h-5 mr-2" />Generate Ideas</>}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'my-recipes' && (
            <div className="mb-8 text-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm"
                >
                    <PlusIcon className="w-5 h-5 mr-2" /> Add New Recipe
                </button>
            </div>
          )}

          {error && <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg mb-8">{error}</div>}

          {isLoading && activeTab === 'explore' && generatedRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Spinner size="lg" />
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Generating delicious ideas...</p>
            </div>
          ) : (
            renderContent()
          )}

        </div>
      </main>
      
      <AddRecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newRecipe) => {
            addMyRecipe(newRecipe);
            setIsModalOpen(false);
        }}
       />
    </div>
  );
}