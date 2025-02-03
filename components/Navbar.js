import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the profile icon
import { useAuth } from '../hooks/useAuth';
import { useRoute } from '@react-navigation/native';

const Navbar = ({ onProfilePress }) => {
    const { signOut } = useAuth();
    const route = useRoute();
    const isDashboard = route.name === 'Dashboard';

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Recipe Hub</Text>
            <View style={styles.rightContainer}>
                {isDashboard && (
                    <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
                        <Ionicons name="log-out-outline" size={35} color="white" />
                    </TouchableOpacity>
                )}
                {!isDashboard && (
                    <TouchableOpacity onPress={onProfilePress}>
                        <Ionicons name="person-circle" size={50} color="white" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    logo: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutButton: {
        marginRight: 15,
    },
});

export default Navbar; 