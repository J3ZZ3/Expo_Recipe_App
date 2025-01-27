import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { RecipeContext } from '../context/RecipeContext';

const AddRecipe = () => {
    const router = useRouter();
    const { addRecipe } = useContext(RecipeContext);
    const [recipe, setRecipe] = useState({
        name: '',
        ingredients: '',
        instructions: '',
        cookingTime: '',
        servings: '',
    });
    const [error, setError] = useState('');

    const handleAdd = async () => {
        try {
            if (!recipe.name.trim()) {
                setError('Recipe name is required');
                return;
            }

            await addRecipe({
                strMeal: recipe.name,
                strInstructions: recipe.instructions,
                strIngredients: recipe.ingredients,
                cookingTime: recipe.cookingTime,
                servings: recipe.servings,
                type: 'user-created'
            });

            router.back();
        } catch (err) {
            setError('Failed to add recipe');
        }
    };

    return (
        <ScrollView style={styles.container}>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            
            <TextInput 
                style={styles.input}
                placeholder="Recipe Name"
                value={recipe.name}
                onChangeText={(text) => setRecipe(prev => ({ ...prev, name: text }))}
            />

            <TextInput 
                style={[styles.input, styles.multiline]}
                placeholder="Ingredients (one per line)"
                value={recipe.ingredients}
                onChangeText={(text) => setRecipe(prev => ({ ...prev, ingredients: text }))}
                multiline
                numberOfLines={4}
            />

            <TextInput 
                style={[styles.input, styles.multiline]}
                placeholder="Instructions"
                value={recipe.instructions}
                onChangeText={(text) => setRecipe(prev => ({ ...prev, instructions: text }))}
                multiline
                numberOfLines={4}
            />

            <TextInput 
                style={styles.input}
                placeholder="Cooking Time (e.g., 30 minutes)"
                value={recipe.cookingTime}
                onChangeText={(text) => setRecipe(prev => ({ ...prev, cookingTime: text }))}
            />

            <TextInput 
                style={styles.input}
                placeholder="Servings"
                value={recipe.servings}
                onChangeText={(text) => setRecipe(prev => ({ ...prev, servings: text }))}
                keyboardType="numeric"
            />

            <Button title="Add Recipe" onPress={handleAdd} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    multiline: {
        height: 100,
        textAlignVertical: 'top',
        padding: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default AddRecipe;
