import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import Navbar from './Navbar';
import { Ionicons } from '@expo/vector-icons';

const EditProfile = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState({
        username: '',
        full_name: '',
        contact: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('username, full_name, contact')
                .eq('id', user?.id)
                .single();

            if (error) throw error;
            if (data) setProfile(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setSaving(true);
            setError(null);

            const { error } = await supabase
                .from('profiles')
                .update({
                    username: profile.username,
                    full_name: profile.full_name,
                    contact: profile.contact,
                    updated_at: new Date(),
                })
                .eq('id', user?.id);

            if (error) throw error;
            navigation.goBack();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

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
                
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Edit Profile</Text>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={profile.username}
                            onChangeText={(text) => setProfile({ ...profile, username: text })}
                            placeholder="Enter username"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={profile.full_name}
                            onChangeText={(text) => setProfile({ ...profile, full_name: text })}
                            placeholder="Enter full name"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Contact</Text>
                        <TextInput
                            style={styles.input}
                            value={profile.contact}
                            onChangeText={(text) => setProfile({ ...profile, contact: text })}
                            placeholder="Enter contact information"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                        onPress={handleUpdate}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons name="save-outline" size={24} color="white" />
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </>
                        )}
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
        backgroundColor: 'rgba(56, 48, 48, 0.41)',
    },
    formContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#FF4D00',
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
        padding: 15,
        color: 'white',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#FF4D00',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 25,
        marginTop: 20,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    errorText: {
        color: '#ff4444',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
        fontSize: 16,
    },
});

export default EditProfile; 