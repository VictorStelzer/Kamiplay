import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Detalhegames from './Detalhegames';

const API_KEY = "639e9921f4054ca28acde410a0278e64";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}`;

type Game = {
    id: number;
    name: string;
    background_image: string;
    released: string;
    rating: number;
};

export default function Novidade({ setScreen }: { setScreen: (screen: string) => void }) {
    const [games, setGames] = useState<Game[]>([]);
    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

    useEffect(() => {
        axios.get(API_URL)
            .then(response => setGames(response.data.results.slice(0, 15)))
            .catch(error => console.error("Erro ao buscar novidades:", error));
    }, []);

    if (selectedGameId !== null) {
        return <Detalhegames setScreen={setScreen} gameId={selectedGameId} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {games.length > 0 && (
                <TouchableOpacity onPress={() => setSelectedGameId(games[0].id)}>
                    <View style={styles.highlightGame}>
                        <Image source={{ uri: games[0].background_image }} style={styles.highlightImage} />
                        <Text style={styles.highlightTitle}>{games[0].name}</Text>
                    </View>
                </TouchableOpacity>
            )}

            <Text style={styles.title}> Novidades</Text>
            <View style={styles.gamesContainer}>
                {games.slice(1).map((game) => (
                    <TouchableOpacity key={game.id} onPress={() => setSelectedGameId(game.id)}>
                        <View style={styles.gameCard}>
                            <Image source={{ uri: game.background_image }} style={styles.gameImage} />
                            <Text style={styles.gameTitle}>{game.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { paddingBottom: 80, alignItems: 'center' },
    highlightGame: { alignItems: 'center', marginBottom: 20, width:400 },
    highlightImage: { width: '95%', height: 200, borderRadius: 10 },
    highlightTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
    title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
    gamesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 },
    gameCard: { backgroundColor: "#fff", padding: 10, borderRadius: 10, alignItems: 'center', width: 160 },
    gameImage: { width: 150, height: 100, borderRadius: 10 },
    gameTitle: { marginTop: 5, fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});
