import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Detalhegames from './Detalhegames';
import Missao from './missao';
import Loja from './Lojinha';
import Novidade from './novidades';
import Jogos from './jogos';
import Promocoes from './promocoes';
import Biblioteca from './biblioteca';
import Perfil from './perfil';

const API_KEY = '639e9921f4054ca28acde410a0278e64';
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}`;

type Game = {
    id: number;
    background_image: string;
    name: string;
    released: string;
    rating: number;
};

export default function Home() {
    const [games, setGames] = useState<Game[]>([]);
    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
    const [screen, setScreen] = useState("home");

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await axios.get(API_URL);
                setGames(response.data.results.slice(0, 11));
            } catch (error) {
                console.error("Erro ao buscar os jogos: ", error);
            }
        }

        fetchGames();
    }, []);

    if (screen === "details" && selectedGameId !== null) {
        return <Detalhegames setScreen={setScreen} gameId={selectedGameId} />;
    }

    if (screen === "perfil") {
        return <Perfil setScreen={setScreen} />;
    }

    if (screen === "missao") {
        return <Missao setScreen={setScreen} />;
    }

    if (screen === "loja") {
        return <Loja setScreen={setScreen} />;
    }

    if (screen === "novidade") {
        return <Novidade setScreen={setScreen} />;
    }

    if (screen === "promocoes") {
        return <Promocoes setScreen={setScreen} />;
    }

    if (screen === "jogos") {
        return <Jogos setScreen={setScreen} />;
    }

    if (screen === "biblioteca") {
        return <Biblioteca setScreen={setScreen} />;
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.profile}>
              
                    <TouchableOpacity onPress={() => setScreen("perfil")}>
                        <Image source={require('../assets/perfil.png')} style={styles.profileImage} resizeMode="contain" />
                    </TouchableOpacity>
                </View>

                <View style={styles.profile}>
                    <TouchableOpacity onPress={() => setScreen("missao")}>
                        <Image source={require('../assets/nivel.png')} style={styles.profileImage1} resizeMode="contain" />
                    </TouchableOpacity>
                </View>

                {games.length > 0 && (
                    <TouchableOpacity onPress={() => { setSelectedGameId(games[0].id); setScreen("details"); }}>
                        <View style={styles.highlightGame}>
                            <Image source={{ uri: games[0].background_image }} style={styles.highlightImage} />
                        </View>
                    </TouchableOpacity>
                )}

                <Text style={styles.sectionTitle}>Jogos Populares</Text>
                <View style={styles.gamesContainer}>
                    {games.slice(1).map((game) => (
                        <TouchableOpacity key={game.id} onPress={() => { setSelectedGameId(game.id); setScreen("details"); }}>
                            <Image source={{ uri: game.background_image }} style={styles.gameImage} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => setScreen("home")}>
                    <Image source={require('../assets/home.png')} style={styles.bottomIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setScreen("biblioteca")}>
                    <Image source={require('../assets/livro.png')} style={styles.bottomIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setScreen("loja")}>
                    <Image source={require('../assets/loja.png')} style={styles.bottomIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#8E8E93' },
    scrollContainer: { paddingBottom: 100, backgroundColor: '#8E8E93' },
    profile: { alignItems: 'center', padding: 20 },
    profileImage: { width: 30, height: 80, borderRadius: 40, marginBottom: 10,left: 130}, 
    profileImage1: { width: 30, marginTop: -120, left: 60, position: "absolute" },
    sectionTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
    highlightGame: { alignItems: 'center', marginBottom: 20 },
    highlightImage: { width: '99%', height: 180, borderRadius: 10 },
    gamesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'center' },
    gameImage: { width: 170, height: 120, borderRadius: 19 },
    bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#3a453c', paddingVertical: 10, position: 'absolute', bottom: 0, width: '100%', borderRadius: 39 },
    bottomIcon: { width: 47, height: 40 },
});
