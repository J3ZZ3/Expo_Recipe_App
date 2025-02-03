import React, { useState } from 'react';
import { 
    View, 
    TextInput, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    ActivityIndicator,
} from 'react-native';
import { Video } from 'expo-av';
import { useAuth } from '../hooks/useAuth';

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
            <Video
                source={require('../assets/videos/login.mp4')}
                style={styles.backgroundVideo}
                resizeMode="cover"
                shouldPlay
                isLooping
                isMuted
            />
            <View style={styles.overlay}>
                <Text style={styles.title}>Recipe Hub</Text>
                <View style={styles.form}>
                    {message ? <Text style={styles.success}>{message}</Text> : null}
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <TouchableOpacity 
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.link}>Don't have an account? Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
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
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 15,
        color: 'white',
        fontSize: 16,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#FF4D00',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    error: {
        color: '#ff4444',
        marginBottom: 10,
    },
    link: {
        color: 'white',
        textAlign: 'center',
        marginTop: 15,
    },
    buttonDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    success: {
        color: '#4CAF50',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default Login; 