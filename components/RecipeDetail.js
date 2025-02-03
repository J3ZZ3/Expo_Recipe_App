import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Linking, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { RecipeContext } from '../context/RecipeContext';
import { Ionicons } from '@expo/vector-icons'; // Import the Ionicons icon set
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';

const RecipeDetail = ({ route, navigation }) => {
    const { recipeId } = route.params; // Get the recipe ID from the route params
    const { fetchRecipeDetails, loadingStates } = useContext(RecipeContext);
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const getRecipeDetails = async () => {
            const recipeData = await fetchRecipeDetails(recipeId);
            setRecipe(recipeData);
        };
        getRecipeDetails();
    }, [recipeId]);

    if (loadingStates.details || !recipe) {
        return (
            <ImageBackground
                source={require('../assets/images/background.jpg')}
                style={styles.background}
            >
                <LoadingSpinner message="Loading recipe details..." />
            </ImageBackground>
        );
    }

    const ingredients = Object.keys(recipe)
        .filter(key => key.startsWith('strIngredient') && recipe[key])
        .map((key, index) => (
            <Text key={index} style={styles.ingredient}>
                {recipe[key]} - {recipe[`strMeasure${index + 1}`]}
            </Text>
        ));

    return (
        <ImageBackground
            source={require('../assets/images/background.jpg')}
            style={styles.background}
        >
            <ScrollView style={styles.container}>
                <Navbar onProfilePress={() => navigation.navigate('Dashboard')} />
                <View style={styles.contentContainer}>
                    <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
                    <Text style={styles.title}>{recipe.strMeal}</Text>

                    {recipe.strYoutube && (
                        <TouchableOpacity 
                            onPress={() => Linking.openURL(recipe.strYoutube)} 
                            style={styles.linkContainer}
                        >
                            <Ionicons name="logo-youtube" size={60} color="#FF0000" />
                            <Text style={styles.linkText}>Watch on YouTube</Text>
                        </TouchableOpacity>
                    )}
                    
                    <View style={styles.section}>
                        <Text style={styles.subtitle}>Ingredients:</Text>
                        <View style={styles.ingredientsContainer}>
                            {ingredients}
                        </View>
                    </View>

                    

                    <View style={styles.section}>
                        <Text style={styles.subtitle}>Instructions:</Text>
                        <Text style={styles.instructions}>{recipe.strInstructions}</Text>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(56, 48, 48, 0.41)',
    },
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        marginTop: 15,
        color: 'white',
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 15,
        marginBottom: 15,
    },
    section: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },
    instructions: {
        fontSize: 16,
        lineHeight: 24,
        color: 'white',
    },
    subtitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#FF4D00',
        textAlign: 'center',
    },
    ingredientsContainer: {
        alignItems: 'center',
    },
    ingredient: {
        fontSize: 16,
        color: 'white',
        marginBottom: 8,
        textAlign: 'center',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 15,
        borderRadius: 15,
    },
    linkText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
});

export default RecipeDetail; 