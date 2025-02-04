import React, { useContext, useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Animated,
} from 'react-native';
import { RecipeContext } from '../context/RecipeContext';
import { Ionicons } from '@expo/vector-icons';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import LoadingSpinner from './LoadingSpinner';

const Explore = ({ navigation }) => {
    const { 
        recipes, 
        filterRecipes, 
        filteredRecipes, 
        categories,
        selectedCategory,
        setSelectedCategory,
        loadingStates 
    } = useContext(RecipeContext);
    const [searchTerm, setSearchTerm] = useState('');
    const sadFaceAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if ((searchTerm || selectedCategory) && filteredRecipes.length === 0) {
            Animated.sequence([
                Animated.timing(sadFaceAnimation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(sadFaceAnimation, {
                    toValue: 0.8,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(sadFaceAnimation, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [filteredRecipes, searchTerm, selectedCategory]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        filterRecipes(term, selectedCategory);
    };

    const handleCategoryPress = (category) => {
        const newCategory = category === selectedCategory ? null : category;
        setSelectedCategory(newCategory);
        filterRecipes(searchTerm, newCategory);
    };

    const displayedRecipes = (searchTerm || selectedCategory) ? filteredRecipes : recipes;

    if (loadingStates.recipes || loadingStates.categories) {
        return (
            <ImageBackground
                source={require('../assets/images/background.jpg')}
                style={styles.background}
            >
                <LoadingSpinner message="Loading recipes and categories..." />
            </ImageBackground>
        );
    }

    return (
        <ImageBackground
            source={require('../assets/images/background.jpg')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Navbar onProfilePress={() => navigation.navigate('Dashboard')} />
                <SearchBar onSearch={handleSearch} />
                
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScroll}
                >
                    {categories.map((category) => (
                        <View key={category.idCategory} style={styles.categoryItem}>
                            <TouchableOpacity
                                style={[
                                    styles.categoryButton,
                                    selectedCategory === category.strCategory && styles.selectedCategory
                                ]}
                                onPress={() => handleCategoryPress(category.strCategory)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === category.strCategory && styles.selectedCategoryText
                                ]}>
                                    {category.strCategory}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                <Text style={styles.title}>
                    {selectedCategory ? selectedCategory : 'All Recipes'}
                </Text>
                
                {(searchTerm || selectedCategory) && filteredRecipes.length === 0 ? (
                    <View style={styles.noResultsContainer}>
                        <Animated.View style={[
                            styles.sadFaceContainer,
                            { transform: [{ scale: sadFaceAnimation }] }
                        ]}>
                            <Ionicons name="sad-outline" size={80} color="white" />
                        </Animated.View>
                        <Text style={styles.noResultsText}>
                            Unfortunately, we couldn't find what you're looking for
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={displayedRecipes}
                        keyExtractor={(item) => item.idMeal}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => navigation.navigate("RecipeDetail", { recipeId: item.idMeal })}
                            >
                                <Image 
                                    source={{ uri: item.strMealThumb }} 
                                    style={styles.image}
                                />
                                <Text style={styles.cardTitle}>{item.strMeal}</Text>
                            </TouchableOpacity>
                        )}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.recipeGrid}
                    />
                )}
            </View>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 15,
    },
    recipeGrid: {
        paddingBottom: 20,
    },
    card: {
        flex: 1,
        margin: 8,
        borderRadius: 10,
        backgroundColor: "transparent",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0,
        shadowRadius: 2,
        padding: 10,
        width: '45%',
        height: 150,
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 10,
    },
    cardTitle: {
        color: 'white',
        marginTop: 5,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
    filterContainer: {
        marginVertical: 10,
    },
    categoryScroll: {
        flexGrow: 0,
    },
    categoryItem: {
        marginRight: 8,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedCategory: {
        backgroundColor: '#FF4D00',
        borderColor: '#FF4D00',
    },
    categoryText: {
        fontSize: 14,
        color: '#333',
    },
    selectedCategoryText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    sadFaceContainer: {
        marginBottom: 20,
    },
    noResultsText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default Explore; 