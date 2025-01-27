import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [randomRecipe, setRandomRecipe] = useState(null);
    const [userRecipes, setUserRecipes] = useState([]);

    // Load user recipes from AsyncStorage on mount
    useEffect(() => {
        loadUserRecipes();
        fetchRecipes();
    }, []);

    const loadUserRecipes = async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem('userRecipes');
            if (storedRecipes) {
                setUserRecipes(JSON.parse(storedRecipes));
            }
        } catch (err) {
            setError('Failed to load saved recipes');
        }
    };

    const fetchRecipes = async () => {
        try {
            const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
            setRecipes(response.data.meals);
            selectRandomRecipe(response.data.meals); // Select a random recipe when fetching
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const selectRandomRecipe = (meals) => {
        if (meals && meals.length > 0) {
            const randomIndex = Math.floor(Math.random() * meals.length);
            setRandomRecipe(meals[randomIndex]); // Set a random recipe
        }
    };

    const fetchRecipeDetails = async (id) => {
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            return response.data.meals[0]; // Return the first meal from the response
        } catch (err) {
            setError(err.message);
            throw err; // Rethrow the error to be caught in RecipeDetail
        }
    };

    const addRecipe = async (newRecipe) => {
        try {
            const recipeWithId = {
                ...newRecipe,
                id: Date.now().toString(), // Generate a unique ID
                createdAt: new Date().toISOString(),
            };

            const updatedRecipes = [...userRecipes, recipeWithId];
            setUserRecipes(updatedRecipes);
            
            // Save to AsyncStorage
            await AsyncStorage.setItem('userRecipes', JSON.stringify(updatedRecipes));
            
            return recipeWithId;
        } catch (err) {
            setError('Failed to add recipe');
            throw err;
        }
    };

    const updateRecipe = async (id, updatedRecipe) => {
        try {
            const updatedRecipes = userRecipes.map(recipe => 
                recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe
            );
            
            setUserRecipes(updatedRecipes);
            await AsyncStorage.setItem('userRecipes', JSON.stringify(updatedRecipes));
            
            return updatedRecipes.find(recipe => recipe.id === id);
        } catch (err) {
            setError('Failed to update recipe');
            throw err;
        }
    };

    const deleteRecipe = async (id) => {
        try {
            const updatedRecipes = userRecipes.filter(recipe => recipe.id !== id);
            setUserRecipes(updatedRecipes);
            await AsyncStorage.setItem('userRecipes', JSON.stringify(updatedRecipes));
        } catch (err) {
            setError('Failed to delete recipe');
            throw err;
        }
    };

    return (
        <RecipeContext.Provider 
            value={{ 
                recipes, 
                error, 
                loading, 
                fetchRecipeDetails, 
                addRecipe, 
                updateRecipe, 
                deleteRecipe, 
                randomRecipe,
                userRecipes 
            }}
        >
            {children}
        </RecipeContext.Provider>
    );
};
