import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { RecipeContext } from '../context/RecipeContext';

const AddRecipe = ({ navigation }) => {
    const { addRecipe } = useContext(RecipeContext);
    const [recipeName, setRecipeName] = useState('');

    const handleAdd = () => {
        addRecipe({ name: recipeName });
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input} 
                placeholder="Recipe Name" 
                value={recipeName} 
                onChangeText={setRecipeName} 
            />
            <Button title="Add Recipe" onPress={handleAdd} />
        </View>
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
    },
});

export default AddRecipe;
