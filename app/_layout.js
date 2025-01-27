import React from 'react';
import { Stack } from 'expo-router';
import { RecipeProvider } from '../context/RecipeContext';
import { AuthProvider } from '../context/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <RecipeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="recipe-list" />
          <Stack.Screen name="add-recipe" />
          <Stack.Screen name="recipe-detail" />
        </Stack>
      </RecipeProvider>
    </AuthProvider>
  );
} 