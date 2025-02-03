import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (text) => {
        setSearchTerm(text);
        onSearch(text);
    };

    const clearSearch = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color="gray" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder="Search recipes..."
                placeholderTextColor="gray"
                value={searchTerm}
                onChangeText={handleSearch}
            />
            {searchTerm.length > 0 && (
                <TouchableOpacity onPress={clearSearch}>
                    <Ionicons name="close-circle" size={20} color="gray" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        marginVertical: 10,
        paddingHorizontal: 15,
        height: 40,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
});

export default SearchBar;