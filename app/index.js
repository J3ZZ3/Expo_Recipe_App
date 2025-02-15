import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RecipeProvider } from '../context/RecipeContext';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import Login from '../components/Login';
import Signup from '../components/Signup';
import RecipeList from '../components/RecipeList';
import AddRecipe from '../components/AddRecipe';
import RecipeDetail from '../components/RecipeDetail';
import Explore from '../components/Explore';
import Dashboard from '../components/Dashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import Profile from '../components/Profile';
import EditProfile from '../components/EditProfile';
import MyRecipes from '../components/MyRecipes';

const Stack = createStackNavigator();

const NavigationWrapper = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner message="Starting Recipe Hub..." />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <>
                    <Stack.Screen name="RecipeList" component={RecipeList} />
                    <Stack.Screen name="MyRecipes" component={MyRecipes} />
                    <Stack.Screen name="AddRecipe" component={AddRecipe} />
                    <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
                    <Stack.Screen name="Explore" component={Explore} />
                    <Stack.Screen name="Dashboard" component={Dashboard} />
                    <Stack.Screen name="Profile" component={Profile} />
                    <Stack.Screen name="EditProfile" component={EditProfile} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Signup" component={Signup} />
                </>
            )}
        </Stack.Navigator>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <RecipeProvider>
                <NavigationContainer>
                    <NavigationWrapper />
                </NavigationContainer>
            </RecipeProvider>
        </AuthProvider>
    );
};

export default App;