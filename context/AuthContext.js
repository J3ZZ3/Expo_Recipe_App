import React, { createContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const mounted = useRef(true);

    useEffect(() => {
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        let subscription;

        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (mounted.current) {
                    setUser(session?.user ?? null);
                    setLoading(false);
                }

                const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
                    (_event, session) => {
                        if (mounted.current) {
                            setUser(session?.user ?? null);
                        }
                    }
                );
                subscription = sub;
            } catch (error) {
                console.error('Auth initialization error:', error);
                if (mounted.current) {
                    setLoading(false);
                }
            }
        };

        initAuth();

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

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

        // Create initial profile
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
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}; 