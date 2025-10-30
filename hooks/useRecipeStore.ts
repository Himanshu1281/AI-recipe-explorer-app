import { useState, useMemo, useCallback } from 'react';
import { type Recipe } from '../types';
import { generateRecipes, generateRecipeImage } from '../services/geminiService';
import { useLocalStorage } from './useLocalStorage';
import { parsePrepTime } from '../utils/time';

type OmitId<T> = Omit<T, 'id'>;
export type NewRecipeData = OmitId<Omit<Recipe, 'imageUrl' | 'imagePrompt'>>;

interface RecipeState {
  generatedRecipes: Recipe[];
  savedRecipes: Recipe[];
  myRecipes: Recipe[];
  filteredGeneratedRecipes: Recipe[];
  filteredSavedRecipes: Recipe[];
  filteredMyRecipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  prepTimeFilter: string;
}

export function useRecipeStore(userId: string) {
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useLocalStorage<Recipe[]>(`savedRecipes_${userId}`, []);
  const [myRecipes, setMyRecipes] = useLocalStorage<Recipe[]>(`myRecipes_${userId}`, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [prepTimeFilter, setPrepTimeFilter] = useState('all');
  
  const generate = useCallback(async (ingredient: string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedRecipes([]);
    setSearchTerm('');
    setPrepTimeFilter('all');

    try {
      const recipesFromApi = await generateRecipes(ingredient);
      
      // Use a traditional for loop to handle async operations sequentially
      for (let i = 0; i < recipesFromApi.length; i++) {
        // Wait before adding the next recipe to the UI
        await new Promise(resolve => setTimeout(resolve, 300));

        const recipeData = recipesFromApi[i];
        const newRecipe: Recipe = {
          ...recipeData,
          id: `${recipeData.name.replace(/\s/g, '-')}-${Date.now()}-${i}`,
          imageUrl: 'loading',
        };

        // Add the new recipe to the state, which will cause a re-render
        setGeneratedRecipes(prev => [...prev, newRecipe]);

        // Kick off image generation for this recipe in the background.
        if (newRecipe.imagePrompt) {
          generateRecipeImage(newRecipe.imagePrompt)
            .then(imageUrl => {
              setGeneratedRecipes(prev => 
                prev.map(p => p.id === newRecipe.id ? { ...p, imageUrl } : p)
              );
            })
            .catch(imgErr => {
              console.error(`Failed to generate image for ${newRecipe.name}:`, imgErr);
              setGeneratedRecipes(prev => 
                prev.map(p => p.id === newRecipe.id ? { ...p, imageUrl: 'error' } : p)
              );
            });
        }
      }
    } catch (err) {
      setError('Failed to generate recipes. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false); // Only set loading to false when the entire process is complete.
    }
  }, []);

  const saveRecipe = (recipeToSave: Recipe) => {
    if (!savedRecipes.some(r => r.id === recipeToSave.id)) {
      setSavedRecipes(prev => [...prev, recipeToSave]);
    }
  };

  const removeRecipe = (recipeId: string) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== recipeId));
  };
  
  const addMyRecipe = (recipeData: NewRecipeData) => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: `${recipeData.name.replace(/\s/g, '-')}-${Date.now()}`,
    };
    setMyRecipes(prev => [...prev, newRecipe]);
  };

  const removeMyRecipe = (recipeId: string) => {
    setMyRecipes(prev => prev.filter(r => r.id !== recipeId));
  }

  const isRecipeSaved = (recipeId: string) => savedRecipes.some(r => r.id === recipeId);

  const filterRecipes = useCallback((recipes: Recipe[]) => {
    return recipes.filter(recipe => {
      const prepTimeMinutes = parsePrepTime(recipe.prepTime);
      const filterTime = prepTimeFilter === 'all' ? Infinity : parseInt(prepTimeFilter, 10);
      if (prepTimeMinutes > filterTime) {
        return false;
      }

      const lowercasedTerm = searchTerm.toLowerCase();
      if (!lowercasedTerm) return true;
      
      const searchableText = [
        recipe.name,
        recipe.description,
        ...recipe.ingredients,
      ].join(' ').toLowerCase();

      return searchableText.includes(lowercasedTerm);
    });
  }, [searchTerm, prepTimeFilter]);
  
  const filteredGeneratedRecipes = useMemo(() => filterRecipes(generatedRecipes), [generatedRecipes, filterRecipes]);
  const filteredSavedRecipes = useMemo(() => filterRecipes(savedRecipes), [savedRecipes, filterRecipes]);
  const filteredMyRecipes = useMemo(() => filterRecipes(myRecipes), [myRecipes, filterRecipes]);


  const state: RecipeState = {
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
  };

  return {
    state,
    generate,
    saveRecipe,
    removeRecipe,
    addMyRecipe,
    removeMyRecipe,
    isRecipeSaved,
    setSearchTerm,
    setPrepTimeFilter,
  };
}