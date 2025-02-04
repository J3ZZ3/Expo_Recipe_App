import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the profile icon
import { useAuth } from '../hooks/useAuth';
import { useRoute } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

const Navbar = memo(({ onProfilePress }) => {
    const { signOut, user } = useAuth();
    const route = useRoute();
    const isDashboard = route.name === 'Dashboard';
    const [profileUrl, setProfileUrl] = useState(null);

    // Add useEffect to fetch profile picture
    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                if (user?.id) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('avatar_url')
                        .eq('id', user.id)
                        .single();
                    
                    if (error) throw error;
                    setProfileUrl(data?.avatar_url);
                }
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        };

        fetchProfilePicture();
    }, [user]);

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Recipe Hub</Text>
            <View style={styles.rightContainer}>
                {isDashboard ? (
                    <TouchableOpacity 
                        onPress={signOut} 
                        style={styles.logoutButton}
                        accessibilityRole="button"
                    >
                        <Ionicons name="log-out-outline" size={35} color="white" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        onPress={onProfilePress}
                        style={styles.profileButton}
                        accessibilityRole="button"
                    >
                        {profileUrl ? (
                            <View style={styles.profileImageWrapper}>
                                <Image
                                    source={{ uri: profileUrl }}
                                    style={styles.profileImage}
                                    accessible={true}
                                    accessibilityLabel="Profile picture"
                                />
                            </View>
                        ) : (
                            <Ionicons 
                                name="person-circle" 
                                size={50} 
                                color="white" 
                            />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 15,
        paddingVertical: 10,
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
    profileButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'transparent',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FF4D00',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

Navbar.displayName = 'Navbar';
export default Navbar; 