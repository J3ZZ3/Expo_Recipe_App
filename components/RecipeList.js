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
  ActivityIndicator,
} from "react-native";
import { RecipeContext } from "../context/RecipeContext";
import Navbar from './Navbar';

const RecipeList = ({ navigation }) => {
  const { recipes, error, loading, randomRecipe } = useContext(RecipeContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4D00" />
        <Text style={styles.loadingText}>Loading recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.replace('RecipeList')}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderRecipeItem = (item) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("RecipeDetail", { recipeId: item.idMeal })
      }
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <Text style={styles.cardTitle}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.background}
    >
      <ScrollView style={styles.container}>
        <Navbar onProfilePress={() => navigation.navigate('Profile')} />
        
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Explore')}
        >
          <Text style={styles.exploreButtonText}>Explore All Recipes</Text>
        </TouchableOpacity>

        {recipes.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Recommended Recipes</Text>
            <FlatList
              data={recipes.slice(0, 10)}
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
                  onPress={() =>
                    navigation.navigate("RecipeDetail", { recipeId: randomRecipe.idMeal })
                  }
                >
                  <Image source={{ uri: randomRecipe.strMealThumb }} style={styles.bannerImage} />
                  <Text style={styles.bannerTitle}>{randomRecipe.strMeal}</Text>
                </TouchableOpacity>
              </>
            )}

            <Text style={styles.sectionTitle}>Recent Recipes</Text>
            <FlatList
              data={recipes.slice(10, 20)}
              keyExtractor={(item) => item.idMeal}
              renderItem={({ item }) => renderRecipeItem(item)}
              horizontal
              showsHorizontalScrollIndicator={false}
            />

            <Text style={styles.sectionTitle}>Regional Recipes</Text>
            <FlatList
              data={recipes.slice(20, 30)}
              keyExtractor={(item) => item.idMeal}
              renderItem={({ item }) => renderRecipeItem(item)}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </>
        ) : (
          <Text style={styles.noRecipesText}>No recipes available</Text>
        )}
        
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
    backgroundColor: "transparent",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 2
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
    backgroundColor: "transparent",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
    color: "white",
  },
  space: {
    height: 40,
  },
  exploreButton: {
    backgroundColor: '#FF4D00',
    padding: 12,
    borderRadius: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  retryButton: {
    backgroundColor: '#FF4D00',
    padding: 12,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noRecipesText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  cardTitle: {
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RecipeList;
