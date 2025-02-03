import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import Navbar from './Navbar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const Profile = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('email, username, full_name, contact')
                .eq('id', user?.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (!data) {
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: user?.id,
                            email: user?.email,
                            username: '',
                            full_name: '',
                            contact: '',
                            updated_at: new Date()
                        }
                    ])
                    .select()
                    .single();

                if (createError) throw createError;
                setProfile(newProfile);
            } else {
                setProfile(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    if (loading) {
        return (
            <ImageBackground
                source={require('../assets/images/background.jpg')}
                style={styles.background}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF4D00" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground
            source={require('../assets/images/background.jpg')}
            style={styles.background}
        >
            <ScrollView style={styles.container}>
                <Navbar onProfilePress={() => navigation.navigate('Dashboard')} />
                
                <View style={styles.profileContainer}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={100} color="white" />
                    </View>

                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : (
                        <>
                            <View style={styles.infoSection}>
                                <Text style={styles.label}>Email</Text>
                                <Text style={styles.value}>{user?.email}</Text>
                            </View>

                            <View style={styles.infoSection}>
                                <Text style={styles.label}>Username</Text>
                                <Text style={styles.value}>
                                    {profile?.username || 'Not set'}
                                </Text>
                            </View>

                            <View style={styles.infoSection}>
                                <Text style={styles.label}>Full Name</Text>
                                <Text style={styles.value}>
                                    {profile?.full_name || 'Not set'}
                                </Text>
                            </View>

                            <View style={styles.infoSection}>
                                <Text style={styles.label}>Contact</Text>
                                <Text style={styles.value}>
                                    {profile?.contact || 'Not set'}
                                </Text>
                            </View>

                            <TouchableOpacity 
                                style={styles.editButton}
                                onPress={() => navigation.navigate('EditProfile')}
                            >
                                <Ionicons name="create-outline" size={24} color="white" />
                                <Text style={styles.editButtonText}>Edit Profile</Text>
                            </TouchableOpacity>
                        </>
                    )}
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
        backgroundColor: 'rgba(56, 48, 48, 0.41)',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(56, 48, 48, 0.41)',
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
        fontSize: 16,
    },
    profileContainer: {
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    infoSection: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    label: {
        color: '#FF4D00',
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    value: {
        color: 'white',
        fontSize: 16,
    },
    editButton: {
        backgroundColor: '#FF4D00',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 25,
        marginTop: 20,
    },
    editButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    errorText: {
        color: '#ff4444',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
});

export default Profile; 