import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { decode } from 'base64-arraybuffer';
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
    const [uploading, setUploading] = useState(false);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('email, username, full_name, contact, avatar_url')
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
                            avatar_url: '',
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

    const pickImage = async () => {
        try {
            // Request permissions first
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access media library is required!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets[0].uri) {
                await uploadAvatar(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            setError('Error selecting image. Please try again.');
        }
    };

    const uploadAvatar = async (uri) => {
        try {
            setUploading(true);
            setError(null);

            // Ensure we have a valid user ID
            if (!user?.id) {
                throw new Error('User ID not found');
            }

            // Compress and resize the image
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 400, height: 400 } }],
                { 
                    compress: 0.8,
                    format: ImageManipulator.SaveFormat.JPEG
                }
            );

            // Create a unique file path that includes the user ID and timestamp
            const timestamp = new Date().getTime();
            const filePath = `${user.id}_${timestamp}.jpg`;

            // Fetch the image as a blob
            const response = await fetch(manipulatedImage.uri);
            const blob = await response.blob();

            // Upload to Supabase Storage
            const { error: uploadError, data } = await supabase.storage
                .from('avatars')
                .upload(filePath, blob, {
                    contentType: 'image/jpeg',
                    cacheControl: '3600'
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Delete old avatar if exists
            if (profile?.avatar_url) {
                try {
                    const oldFilePath = profile.avatar_url.split('/').pop().split('?')[0];
                    await supabase.storage
                        .from('avatars')
                        .remove([oldFilePath]);
                } catch (deleteError) {
                    console.error('Error deleting old avatar:', deleteError);
                }
            }

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ 
                    avatar_url: publicUrl,
                    updated_at: new Date()
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Update local state
            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));

            // Force refresh the image by updating the state
            const refreshedUrl = `${publicUrl}?t=${timestamp}`;
            setProfile(prev => ({ ...prev, avatar_url: refreshedUrl }));

        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Error uploading image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <ImageBackground
                source={require('../assets/images/profile.jpg')}
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
                <Navbar onProfilePress={() => navigation.navigate('Dashboard')} profileUrl={profile?.avatar_url} />
                
                <View style={styles.profileContainer}>
                    <TouchableOpacity 
                        style={styles.avatarContainer} 
                        onPress={pickImage}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <ActivityIndicator size="large" color="#FF4D00" />
                        ) : profile?.avatar_url ? (
                            <View style={styles.avatarWrapper}>
                                <Image
                                    source={{ uri: profile.avatar_url }}
                                    style={styles.avatar}
                                    resizeMode="cover"
                                />
                            </View>
                        ) : (
                            <Ionicons name="person-circle" size={100} color="white" />
                        )}
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>

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
        marginBottom: 20,
    },
    avatarWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'transparent',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FF4D00',
    },
    avatar: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
    },
    changePhotoText: {
        color: '#FF4D00',
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
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