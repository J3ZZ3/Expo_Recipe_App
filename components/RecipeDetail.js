import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { RecipeContext } from '../context/RecipeContext';
import { Ionicons } from '@expo/vector-icons'; // Import the Ionicons icon set

const RecipeDetail = () => {
    const { recipeId } = useLocalSearchParams();
    const { fetchRecipeDetails } = useContext(RecipeContext);
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const getRecipeDetails = async () => {
            const recipeData = await fetchRecipeDetails(recipeId);
            setRecipe(recipeData);
        };
        getRecipeDetails();
    }, [recipeId]);

    if (!recipe) {
        return <Text>Loading...</Text>; // Show loading text while fetching
    }

    const ingredients = Object.keys(recipe)
        .filter(key => key.startsWith('strIngredient') && recipe[key])
        .map((key, index) => (
            <Text key={index} style={styles.ingredient}>
                {recipe[key]} - {recipe[`strMeasure${index + 1}`]}
            </Text>
        ));

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
            <Text style={styles.title}>{recipe.strMeal}</Text>
            <Text style={styles.subtitle}>Ingredients:</Text>
            <View style={styles.ingredientsContainer}>
                {ingredients}
            </View>
            {recipe.strYoutube && (
                <TouchableOpacity onPress={() => Linking.openURL(recipe.strYoutube)} style={styles.linkContainer}>
                    <Ionicons name="logo-youtube" size={60} color="red" />
                </TouchableOpacity>
            )}
            <Text style={styles.subtitle}>Instructions:</Text>
            <Text style={styles.instructions}>{recipe.strInstructions}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(197, 96, 13, 0.67)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        marginTop: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    instructions: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
        marginBottom: 10,   
    },
    ingredientsContainer: {
        alignItems: 'center',
    },
    ingredient: {
        fontSize: 16,
        textAlign: 'center',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
});

export default RecipeDetail; 