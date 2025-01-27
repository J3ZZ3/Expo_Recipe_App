import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useRouter } from 'expo-router';
import { RecipeContext } from "../context/RecipeContext";
import Navbar from './Navbar';

const RecipeList = () => {
  const router = useRouter();
  const { recipes, error, loading, randomRecipe } = useContext(RecipeContext);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const recommendedRecipes = recipes.slice(0, 10);
  const recentRecipes = recipes.slice(10, 20);
  const regionalRecipes = recipes.slice(20, 30);

  const renderRecipeItem = (item) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({
        pathname: "/recipe-detail",
        params: { recipeId: item.idMeal }
      })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.background}
    >
      <ScrollView style={styles.container}>
        <Navbar onProfilePress={() => router.push("/profile")} />
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Text style={styles.sectionTitle}>Recommended Recipes</Text>
        <FlatList
          data={recommendedRecipes}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => renderRecipeItem(item)}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        {randomRecipe && (
          <>
            <Text style={styles.sectionTitle}>Recipe of the Week</Text>
            <TouchableOpacity
              style={styles.banner}
              onPress={() => router.push({
                pathname: "/recipe-detail",
                params: { recipeId: randomRecipe.idMeal }
              })}
            >
              <Image source={{ uri: randomRecipe.strMealThumb }} style={styles.bannerImage} />
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.sectionTitle}>Recent Recipes</Text>
        <FlatList
          data={recentRecipes}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => renderRecipeItem(item)}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.sectionTitle}>Regional Recipes</Text>
        <FlatList
          data={regionalRecipes}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => renderRecipeItem(item)}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.space} />
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
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "white",
  },
  card: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#f9c2ff",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  banner: {
    marginVertical: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f9c2ff",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: 150,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
  space: {
    height: 40,
  },
});

export default RecipeList;
