import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import Button from './common/Button';
import Input from './common/Input';

const Login = ({ navigation, route }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(route.params?.message || '');

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            setMessage('');
            await signIn(email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/login.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <Text style={styles.title}>Recipe Hub</Text>
                    <View style={styles.form}>
                        {message ? <Text style={styles.success}>{message}</Text> : null}
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            autoCapitalize="none"
                        />
                        <Input
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            secureTextEntry
                        />
                        {error ? <Text style={styles.error}>{error}</Text> : null}
                        <Button
                            title="Login"
                            onPress={handleLogin}
                            loading={loading}
                        />
                        <Button
                            title="Don't have an account? Sign up"
                            onPress={() => navigation.navigate('Signup')}
                            style={styles.linkButton}
                            textStyle={styles.linkText}
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: 'rgba(56, 48, 48, 0.6)',
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 40,
    },
    form: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 20,
        borderRadius: 15,
    },
    error: {
        color: '#ff4444',
        marginBottom: 10,
    },
    success: {
        color: '#4CAF50',
        marginBottom: 10,
        textAlign: 'center',
    },
    linkButton: {
        backgroundColor: 'transparent',
        padding: 0,
        marginTop: 15,
    },
    linkText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default Login; 