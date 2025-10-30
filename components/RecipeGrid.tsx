import React from 'react';
import { type Recipe } from '../types';
import RecipeCard from './RecipeCard';
import EmptyState from './EmptyState';
import { SearchIcon } from './Icons';

interface RecipeGridProps {
    recipes: Recipe[];
    onSelectRecipe: (recipe: Recipe) => void;
    onSave?: (recipe: Recipe) => void;
    onRemove?: (recipeId: string) => void;
    isRecipeSaved: (recipeId: string) => boolean;
    originalListLength: number;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ 
    recipes, 
    onSelectRecipe, 
    onSave, 
    onRemove,
    isRecipeSaved,
    originalListLength 
}) => {

    if (recipes.length === 0 && originalListLength > 0) {
        return (
            <EmptyState
                Icon={SearchIcon}
                title="No Recipes Found"
                message="Try adjusting your search or filters."
            />
        );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map(recipe => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onSelect={onSelectRecipe}
            onSave={!onSave ? undefined : () => onSave(recipe)}
            onRemove={onRemove ? () => onRemove(recipe.id) : undefined}
            isSaved={isRecipeSaved(recipe.id)}
          />
        ))}
      </div>
    );
};

export default RecipeGrid;
