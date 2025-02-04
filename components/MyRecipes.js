import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from './LoadingSpinner';
import { RecipeContext } from '../context/RecipeContext';

const MyRecipes = ({ navigation }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const { favoriteRecipes } = useContext(RecipeContext);
    const [activeTab, setActiveTab] = useState('my');

    const fetchUserRecipes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRecipes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserRecipes();
    }, []);

    const renderRecipeItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RecipeDetail', { 
                recipeId: item.id,
                isUserRecipe: true 
            })}
        >
            <Image 
                source={item.image_url ? { uri: item.image_url } : require('../assets/images/rd_bg.jpg')} 
                style={styles.image}
            />
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.categoryText}>{item.category}</Text>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={60} color="white" />
            <Text style={styles.emptyText}>You haven't added any recipes yet</Text>
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('AddRecipe')}
            >
                <Text style={styles.addButtonText}>Add Your First Recipe</Text>
            </TouchableOpacity>
        </View>
    );

    const displayedRecipes = activeTab === 'my' ? recipes : favoriteRecipes.map(fav => fav.recipe_data);

    if (loading) {
        return (
            <ImageBackground
                source={require('../assets/images/background.jpg')}
                style={styles.background}
            >
                <LoadingSpinner message="Loading your recipes..." />
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
                <Text style={styles.title}>My Recipes</Text>
                
                <View style={styles.tabContainer}>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'my' && styles.activeTab]}
                        onPress={() => setActiveTab('my')}
                    >
                        <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
                            My Recipes
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
                        onPress={() => setActiveTab('favorites')}
                    >
                        <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
                            Favorites
                        </Text>
                    </TouchableOpacity>
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                {displayedRecipes.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <FlatList
                        data={displayedRecipes}
                        renderItem={renderRecipeItem}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        contentContainerStyle={styles.recipeGrid}
                    />
                )}

                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddRecipe')}
                >
                    <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
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
    card: {
        flex: 1,
        margin: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 10,
        alignItems: 'center',
        width: '45%',
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 8,
    },
    cardTitle: {
        color: 'white',
        marginTop: 8,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    categoryText: {
        color: '#FF4D00',
        fontSize: 12,
        marginTop: 4,
    },
    errorText: {
        color: '#ff4444',
        textAlign: 'center',
        marginBottom: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    addButton: {
        backgroundColor: '#FF4D00',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#FF4D00',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    recipeGrid: {
        paddingBottom: 80,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#FF4D00',
    },
    tabText: {
        color: 'white',
        fontSize: 16,
    },
    activeTabText: {
        color: '#FF4D00',
        fontWeight: 'bold',
    },
});

export default MyRecipes; 