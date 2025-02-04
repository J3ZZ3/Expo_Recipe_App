import React, { createContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const mounted = useRef(true);

    useEffect(() => {
        // Check for existing session on app start
        checkUser();

        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted.current) {
                setUser(session?.user ?? null);
                setLoading(false);
                
                // Store session if exists, remove if not
                if (session) {
                    AsyncStorage.setItem('supabase.auth.token', JSON.stringify(session));
                } else {
                    AsyncStorage.removeItem('supabase.auth.token');
                }
            }
        });

        return () => {
            mounted.current = false;
            subscription?.unsubscribe();
        };
    }, []);

    const checkUser = async () => {
        try {
            // Check for existing session in AsyncStorage
            const sessionStr = await AsyncStorage.getItem('supabase.auth.token');
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                const { data: { user: currentUser } } = await supabase.auth.getUser(session.access_token);
                if (currentUser) {
                    setUser(currentUser);
                }
            }
        } catch (error) {
            console.error('Error checking user session:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;

        // Create user profile
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        email: data.user.email,
                        username: '',
                        full_name: '',
                        contact: '',
                        avatar_url: '',
                        updated_at: new Date()
                    }
                ]);
            if (profileError) throw profileError;
        }

        return data;
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            await AsyncStorage.removeItem('supabase.auth.token');
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            signIn, 
            signUp, 
            signOut 
        }}>
            {children}
        </AuthContext.Provider>
    );
}; 