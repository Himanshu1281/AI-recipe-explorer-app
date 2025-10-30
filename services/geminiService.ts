import { GoogleGenAI, Type, Modality } from "@google/genai";
import { type Recipe } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'The name of the recipe.',
    },
    description: {
      type: Type.STRING,
      description: 'A brief, enticing description of the dish.',
    },
    prepTime: {
      type: Type.STRING,
      description: 'Preparation time, e.g., "15 minutes".',
    },
    cookTime: {
      type: Type.STRING,
      description: 'Cooking time, e.g., "30 minutes".',
    },
    ingredients: {
      type: Type.ARRAY,
      description: 'A list of ingredients with quantities.',
      items: {
        type: Type.STRING,
      },
    },
    instructions: {
      type: Type.ARRAY,
      description: 'Step-by-step cooking instructions.',
      items: {
        type: Type.STRING,
      },
    },
    imagePrompt: {
      type: Type.STRING,
      description: 'A detailed, creative, and photorealistic image prompt for a food photography shot of this dish. This should include descriptions of the lighting, plating, and background.'
    }
  },
  required: ['name', 'description', 'prepTime', 'cookTime', 'ingredients', 'instructions', 'imagePrompt'],
};


export const generateRecipes = async (ingredient: string): Promise<Omit<Recipe, 'id' | 'imageUrl'>[]> => {
  try {
    const prompt = `Generate 4 diverse and delicious recipes that feature ${ingredient} as a main ingredient. For each recipe, also create a detailed prompt for an image generation model. Provide the output in a clean JSON array format.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: recipeSchema,
        },
      },
    });
    
    const jsonText = response.text.trim();
    const recipes = JSON.parse(jsonText);
    
    if (!Array.isArray(recipes)) {
        throw new Error("API did not return an array of recipes.");
    }

    return recipes;
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Could not fetch recipes from the Gemini API.");
  }
};

export const generateRecipeImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
              parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error('No image data found in response');
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Could not generate image from the Gemini API.");
    }
}