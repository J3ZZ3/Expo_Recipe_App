import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the profile icon
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ onProfilePress }) => {
    const { signOut } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Recipe Hub</Text>
            <TouchableOpacity onPress={onProfilePress}>
                <Ionicons name="person-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut}>
                <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
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
});

export default Navbar; 