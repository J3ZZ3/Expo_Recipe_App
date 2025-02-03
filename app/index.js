import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RecipeProvider } from '../context/RecipeContext';
import RecipeList from '../components/RecipeList';
import AddRecipe from '../components/AddRecipe';
import RecipeDetail from '../components/RecipeDetail';
import Explore from '../components/Explore';

const Stack = createStackNavigator();

const App = () => {
    return (
        <RecipeProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="RecipeList" component={RecipeList} />
                    <Stack.Screen name="AddRecipe" component={AddRecipe} />
                    <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
                    <Stack.Screen name="Explore" component={Explore} />
                </Stack.Navigator>
            </NavigationContainer>
        </RecipeProvider>
    );
};

export default App;