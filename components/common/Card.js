import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Card = ({ 
    title, 
    imageUrl, 
    onPress,
    style,
    imageStyle,
    titleStyle 
}) => {
    return (
        <TouchableOpacity 
            style={[styles.card, style]} 
            onPress={onPress}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
        >
            <Image 
                source={{ uri: imageUrl }} 
                style={[styles.image, imageStyle]}
                loading="lazy"
            />
            <Text style={[styles.title, titleStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        overflow: 'hidden',
        margin: 8,
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    title: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        padding: 10,
        textAlign: 'center',
    },
});

export default Card; 