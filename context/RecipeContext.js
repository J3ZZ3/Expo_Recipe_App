import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [randomRecipe, setRandomRecipe] = useState(null);

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
        // Implement the logic to add a recipe
    };

    const updateRecipe = async (id, updatedRecipe) => {
        // Implement the logic to update a recipe
    };

    const deleteRecipe = async (id) => {
        // Implement the logic to delete a recipe
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    return (
        <RecipeContext.Provider value={{ recipes, error, loading, fetchRecipeDetails, addRecipe, updateRecipe, deleteRecipe, randomRecipe }}>
            {children}
        </RecipeContext.Provider>
    );
};
