export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  imagePrompt?: string;
  imageUrl?: string; // 'loading', 'error', or a base64 string
}
