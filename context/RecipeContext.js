import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [randomRecipe, setRandomRecipe] = useState(null);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            // Fetch initial set of recipes
            const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
            
            if (response.data.meals) {
                setRecipes(response.data.meals);
                // Select a random recipe from the fetched meals
                const randomIndex = Math.floor(Math.random() * response.data.meals.length);
                setRandomRecipe(response.data.meals[randomIndex]);
            }
            
            // Fetch categories separately
            const categoriesResponse = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
            if (categoriesResponse.data.categories) {
                setCategories(categoriesResponse.data.categories);
            }

        } catch (err) {
            console.error('Error fetching recipes:', err);
            setError('Failed to load recipes. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filterRecipes = (searchTerm, category) => {
        let filtered = [...recipes];
        
        if (!searchTerm && !category) {
            setFilteredRecipes([]);
            return;
        }
        
        if (searchTerm) {
            filtered = filtered.filter(recipe => 
                recipe.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (category) {
            filtered = filtered.filter(recipe => 
                recipe.strCategory === category
            );
        }
        
        setFilteredRecipes(filtered);
    };

    const fetchRecipeDetails = async (id) => {
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            return response.data.meals[0];
        } catch (err) {
            console.error('Error fetching recipe details:', err);
            setError('Failed to load recipe details. Please try again later.');
            throw err;
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
        <RecipeContext.Provider value={{ 
            recipes, 
            error, 
            loading, 
            fetchRecipeDetails, 
            addRecipe, 
            updateRecipe, 
            deleteRecipe, 
            randomRecipe,
            searchRecipes: filterRecipes,
            filteredRecipes,
            categories,
            selectedCategory,
            setSelectedCategory,
            filterRecipes,
        }}>
            {children}
        </RecipeContext.Provider>
    );
};
