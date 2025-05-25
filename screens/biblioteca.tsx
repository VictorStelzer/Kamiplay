import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Game = {
    id: number;
    name: string;
    background_image: string;
};

export default function Biblioteca({ setScreen }: { setScreen: (screen: string) => void }) {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        async function loadLibrary() {
            const storedGames = await AsyncStorage.getItem("library");
            if (storedGames) setGames(JSON.parse(storedGames));
        }
        loadLibrary();
    }, []);

    async function removeGame(gameId: number) {
        const updatedGames = games.filter(game => game.id !== gameId);
        await AsyncStorage.setItem("library", JSON.stringify(updatedGames));
        setGames(updatedGames);
        Alert.alert("Removido", "Jogo removido da biblioteca!");
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}> Biblioteca de Jogos</Text>

            {games.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum jogo na biblioteca!</Text>
            ) : (
                <View style={styles.gamesContainer}>
                    {games.map((game) => (
                        <View key={game.id} style={styles.gameCard}>
                            <Image source={{ uri: game.background_image }} style={styles.gameImage} />
                            <Text style={styles.gameTitle}>{game.name}</Text>
                            <TouchableOpacity style={styles.removeButton} onPress={() => removeGame(game.id)}>
                                <Text style={styles.buttonText}>🗑 Remover</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            <TouchableOpacity style={styles.backButton} onPress={() => setScreen("home")}>
                <Text style={styles.buttonText}>⬅ Voltar para Home</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    scrollContainer: { paddingBottom: 80, alignItems: 'center', color:'#222' },
    title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
    emptyText: { fontSize: 18, color: '#555', textAlign: 'center', marginTop: 20 },
    gamesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15},
    gameCard: { backgroundColor: "#fff", padding: 10, borderRadius: 10, alignItems: 'center', width: 160 },
    gameImage: { width: 150, height: 100, borderRadius: 10 },
    gameTitle: { marginTop: 5, fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    removeButton: { backgroundColor: '#FF3B30', padding: 10, borderRadius: 8, marginTop: 10 },
    backButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginTop: 20 },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});
