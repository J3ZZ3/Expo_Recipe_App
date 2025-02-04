import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Button = ({ 
    onPress, 
    title, 
    loading, 
    disabled, 
    icon, 
    style, 
    textStyle,
    iconSize = 24,
    iconColor = 'white'
}) => {
    return (
        <TouchableOpacity 
            style={[styles.button, disabled && styles.buttonDisabled, style]}
            onPress={onPress}
            disabled={loading || disabled}
        >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <>
                    {icon && <Ionicons name={icon} size={iconSize} color={iconColor} style={styles.icon} />}
                    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF4D00',
        padding: 15,
        borderRadius: 25,
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    icon: {
        marginRight: 10,
    },
});

export default Button; 