import React, { useState, FormEvent, useEffect } from 'react';
import { type NewRecipeData } from '../hooks/useRecipeStore';

interface AddRecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (recipe: NewRecipeData) => void;
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    
    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal closes
            setName('');
            setDescription('');
            setPrepTime('');
            setCookTime('');
            setIngredients('');
            setInstructions('');
        }
    }, [isOpen]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const newRecipe: NewRecipeData = {
            name,
            description,
            prepTime,
            cookTime,
            ingredients: ingredients.split('\n').filter(line => line.trim() !== ''),
            instructions: instructions.split('\n').filter(line => line.trim() !== ''),
        };
        onSave(newRecipe);
    };
    
    if (!isOpen) return null;

    const inputClasses = "mt-1 block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add a New Recipe</h2>
                </div>
                <form id="add-recipe-form" onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recipe Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={2} className={inputClasses} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div>
                               <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prep Time</label>
                               <input type="text" id="prepTime" value={prepTime} onChange={e => setPrepTime(e.target.value)} required placeholder="e.g., 15 minutes" className={inputClasses} />
                           </div>
                           <div>
                               <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cook Time</label>
                               <input type="text" id="cookTime" value={cookTime} onChange={e => setCookTime(e.target.value)} required placeholder="e.g., 30 minutes" className={inputClasses} />
                           </div>
                        </div>
                        <div>
                            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ingredients (one per line)</label>
                            <textarea id="ingredients" value={ingredients} onChange={e => setIngredients(e.target.value)} required rows={5} className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instructions (one step per line)</label>
                            <textarea id="instructions" value={instructions} onChange={e => setInstructions(e.target.value)} required rows={5} className={inputClasses} />
                        </div>
                    </div>
                </form>
                <div className="p-6 border-t dark:border-gray-700 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                        Cancel
                    </button>
                    <button type="submit" form="add-recipe-form" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700">
                        Save Recipe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRecipeModal;