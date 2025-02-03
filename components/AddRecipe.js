import React, { useContext, useState } from 'react';
import { 
    View, 
    TextInput, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    ImageBackground,
    ScrollView 
} from 'react-native';
import { RecipeContext } from '../context/RecipeContext';
import Navbar from './Navbar';
import { Ionicons } from '@expo/vector-icons';

const AddRecipe = ({ navigation }) => {
    const { addRecipe } = useContext(RecipeContext);
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');

    const handleAdd = () => {
        addRecipe({ 
            name: recipeName,
            ingredients: ingredients,
            instructions: instructions
        });
        navigation.goBack();
    };

    return (
        <ImageBackground
            source={require('../assets/images/cotton.jpg')}
            style={styles.background}
        >
            <ScrollView style={styles.container}>
                <Navbar onProfilePress={() => navigation.navigate('Dashboard')} />
                
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Add New Recipe</Text>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Dashboard')}
                        style={styles.trashButton}
                    >
                        <Ionicons name="trash-outline" size={28} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Recipe Name</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Enter recipe name" 
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={recipeName} 
                        onChangeText={setRecipeName}
                    />

                    <Text style={styles.label}>Ingredients</Text>
                    <TextInput 
                        style={[styles.input, styles.multilineInput]} 
                        placeholder="Enter ingredients (one per line)" 
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={ingredients} 
                        onChangeText={setIngredients}
                        multiline
                        numberOfLines={4}
                    />

                    <Text style={styles.label}>Instructions</Text>
                    <TextInput 
                        style={[styles.input, styles.multilineInput]} 
                        placeholder="Enter cooking instructions" 
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={instructions} 
                        onChangeText={setInstructions}
                        multiline
                        numberOfLines={6}
                    />

                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={handleAdd}
                    >
                        <Ionicons name="add-circle" size={24} color="white" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Add Recipe</Text>
                    </TouchableOpacity>


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
        padding: 20,
        backgroundColor: 'rgba(56, 48, 48, 0.41)',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    trashButton: {
        padding: 8,
    },
    inputContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },
    label: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 15,
        color: 'white',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    addButton: {
        backgroundColor: '#FF4D00',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 25,
        marginTop: 30,
    },
    cancelButton: {
        backgroundColor: '#FF0000',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 25,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    buttonIcon: {
        marginRight: 5,
    },

});

export default AddRecipe;
