import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import Navbar from './Navbar';
import { Ionicons } from '@expo/vector-icons';

const Dashboard = ({ navigation }) => {
    return (
        <ImageBackground
            source={require('../assets/images/shvesta.jpg')}
            style={styles.background}
        >
            <ScrollView style={styles.container}>
                <Navbar onProfilePress={() => navigation.navigate('Dashboard')} />
                <Text style={styles.title}>Dashboard</Text>

                <View style={styles.menuGrid}>
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('MyRecipes')}
                    >
                        <Ionicons name="book" size={40} color="#FF4D00" />
                        <Text style={styles.menuText}>My Recipes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('AddRecipe')}
                    >
                        <Ionicons name="add-circle" size={40} color="#FF4D00" />
                        <Text style={styles.menuText}>Add Recipe</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Explore')}
                    >
                        <Ionicons name="search" size={40} color="#FF4D00" />
                        <Text style={styles.menuText}>Explore</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Ionicons name="person" size={40} color="#FF4D00" />
                        <Text style={styles.menuText}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('RecipeList')}
                    >
                        <Ionicons name="home" size={40} color="#FF4D00" />
                        <Text style={styles.menuText}>Home</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 20,
        textAlign: 'center',
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },
    menuItem: {
        width: '45%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    menuText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default Dashboard; 