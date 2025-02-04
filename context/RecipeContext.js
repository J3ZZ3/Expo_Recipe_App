import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [randomRecipe, setRandomRecipe] = useState(null);
    const [loadingStates, setLoadingStates] = useState({
        recipes: true,
        categories: true,
        details: false,
        adding: false,
        updating: false,
        deleting: false,
    });
    const [userRecipes, setUserRecipes] = useState([]);
    const [isOnline, setIsOnline] = useState(true);
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);

    const updateLoadingState = (key, value) => {
        setLoadingStates(prev => ({ ...prev, [key]: value }));
    };

    const fetchRecipes = async () => {
        try {
            updateLoadingState('recipes', true);
            updateLoadingState('categories', true);

            // Fetch both recipes and categories in parallel
            const [recipesResponse, categoriesResponse] = await Promise.all([
                axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s='),
                axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
            ]);
            
            if (recipesResponse.data.meals) {
                setRecipes(recipesResponse.data.meals);
                const randomIndex = Math.floor(Math.random() * recipesResponse.data.meals.length);
                setRandomRecipe(recipesResponse.data.meals[randomIndex]);
            }
            
            if (categoriesResponse.data.categories) {
                setCategories(categoriesResponse.data.categories);
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load recipes and categories. Please try again later.');
        } finally {
            updateLoadingState('recipes', false);
            updateLoadingState('categories', false);
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
            updateLoadingState('details', true);
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            return response.data.meals[0];
        } catch (err) {
            console.error('Error fetching recipe details:', err);
            setError('Failed to load recipe details. Please try again later.');
            throw err;
        } finally {
            updateLoadingState('details', false);
        }
    };

    const addRecipe = async (newRecipe) => {
        try {
            updateLoadingState('adding', true);

            if (isOnline) {
                const { data, error } = await supabase
                    .from('recipes')
                    .insert([newRecipe])
                    .select()
                    .single();

                if (error) throw error;

                setUserRecipes(prev => [data, ...prev]);
                await AsyncStorage.setItem('userRecipes', JSON.stringify([data, ...userRecipes]));
            } else {
                // Store locally and sync later
                const tempRecipe = { ...newRecipe, id: Date.now(), pendingSync: true };
                setUserRecipes(prev => [tempRecipe, ...prev]);
                await AsyncStorage.setItem('userRecipes', JSON.stringify([tempRecipe, ...userRecipes]));
            }
        } catch (error) {
            console.error('Error adding recipe:', error);
            throw error;
        } finally {
            updateLoadingState('adding', false);
        }
    };

    const updateRecipe = async (id, updatedRecipe) => {
        // Implement the logic to update a recipe
    };

    const deleteRecipe = async (id) => {
        // Implement the logic to delete a recipe
    };

    // Monitor network connectivity
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    // Load user recipes from local storage
    useEffect(() => {
        loadLocalUserRecipes();
    }, []);

    const loadLocalUserRecipes = async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem('userRecipes');
            if (storedRecipes) {
                setUserRecipes(JSON.parse(storedRecipes));
            }
        } catch (error) {
            console.error('Error loading local recipes:', error);
        }
    };

    const syncWithSupabase = async () => {
        if (!isOnline) return;

        try {
            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setUserRecipes(data);
            await AsyncStorage.setItem('userRecipes', JSON.stringify(data));
        } catch (error) {
            console.error('Error syncing with Supabase:', error);
        }
    };

    // Sync pending recipes when back online
    useEffect(() => {
        if (isOnline) {
            syncPendingRecipes();
        }
    }, [isOnline]);

    const syncPendingRecipes = async () => {
        const pendingRecipes = userRecipes.filter(recipe => recipe.pendingSync);
        
        for (const recipe of pendingRecipes) {
            try {
                const { data, error } = await supabase
                    .from('recipes')
                    .insert([{
                        ...recipe,
                        pendingSync: undefined,
                        id: undefined
                    }])
                    .select()
                    .single();

                if (error) throw error;

                // Update local storage with synced recipe
                const updatedRecipes = userRecipes.map(r => 
                    r.id === recipe.id ? data : r
                );
                setUserRecipes(updatedRecipes);
                await AsyncStorage.setItem('userRecipes', JSON.stringify(updatedRecipes));
            } catch (error) {
                console.error('Error syncing pending recipe:', error);
            }
        }
    };

    // Add new function to toggle favorite status
    const toggleFavorite = async (recipe) => {
        try {
            const { user } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const isFavorite = favoriteRecipes.some(fav => fav.recipe_id === recipe.idMeal);

            if (isFavorite) {
                // Remove from favorites
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('recipe_id', recipe.idMeal);

                if (error) throw error;
                setFavoriteRecipes(prev => prev.filter(fav => fav.recipe_id !== recipe.idMeal));
            } else {
                // Add to favorites
                const { error } = await supabase
                    .from('favorites')
                    .insert([{
                        user_id: user.id,
                        recipe_id: recipe.idMeal,
                        recipe_data: recipe
                    }]);

                if (error) throw error;
                setFavoriteRecipes(prev => [...prev, { recipe_id: recipe.idMeal, recipe_data: recipe }]);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
    };

    // Add function to fetch user's favorites
    const fetchFavorites = async () => {
        try {
            const { user } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('favorites')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;
            setFavoriteRecipes(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    // Fetch favorites when component mounts
    useEffect(() => {
        fetchFavorites();
    }, []);

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
            loadingStates,
            userRecipes,
            isOnline,
            syncWithSupabase,
            favoriteRecipes,
            toggleFavorite,
            fetchFavorites,
        }}>
            {children}
        </RecipeContext.Provider>
    );
};
