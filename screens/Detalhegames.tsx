import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_KEY = '639e9921f4054ca28acde410a0278e64';

type Game = {
    id: number;
    name: string;
    background_image: string;
    released: string;
    rating: number;
    genres: { name: string }[];
    esrb_rating?: { name: string };
    description?: string;
    description_raw?: string;
};

export default function Detalhegames({ setScreen, gameId }: { setScreen: (screen: string) => void; gameId: number }) {
    const [game, setGame] = useState<Game | null>(null);

    useEffect(() => {
        async function fetchGameDetails() {
            try {
                const response = await axios.get(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
                setGame(response.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes do jogo: ", error);
            }
        }
        fetchGameDetails();
    }, [gameId]);

    async function addToLibrary() {
        if (!game) return;

        const storedGames = await AsyncStorage.getItem("library");
        const gamesList: Game[] = storedGames ? JSON.parse(storedGames) : [];

        if (!gamesList.some(g => g.id === game.id)) {
            gamesList.push(game);
            await AsyncStorage.setItem("library", JSON.stringify(gamesList));
            Alert.alert("Adicionado", "Jogo salvo na biblioteca!");
        } else {
            Alert.alert("Já adicionado", "Este jogo já está na biblioteca!");
        }
    }

    const openTrailer = () => {
        const youtubeSearchURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(game?.name ?? "")}+trailer`;
        Linking.openURL(youtubeSearchURL);
    };

    if (!game) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}> Carregando detalhes do jogo...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Image source={{ uri: game?.background_image }} style={styles.gameImage} />
                <Text style={styles.gameTitle}>{game?.name ?? "Nome não disponível"}</Text>
                <Text style={styles.infoText}>📅 Lançamento: {game?.released ?? "Data não disponível"}</Text>
                <Text style={styles.infoText}>⭐ Avaliação: {game?.rating ?? "Sem avaliação"}</Text>
                <Text style={styles.infoText}>
                    🎭 Gênero: {game?.genres?.length ? game.genres.map(g => g.name).join(", ") : "Não especificado"}
                </Text>
                <Text style={styles.infoText}>🔞 Faixa Etária: {game?.esrb_rating?.name ?? "Não especificado"}</Text>

                <Text style={styles.descriptionTitle}>📝 Como funciona o jogo:</Text>
                <Text style={styles.descriptionText}>
                    {game?.description_raw
                        ? game.description_raw.replace(/<\/?[^>]+(>|$)/g, "")
                        : game?.description
                        ? game.description.replace(/<\/?[^>]+(>|$)/g, "")
                        : "Sem informações disponíveis."}
                </Text>

                <TouchableOpacity style={styles.trailerButton} onPress={openTrailer}>
                    <Text style={styles.buttonText}>🎬 Assistir Trailer</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.libraryButton} onPress={addToLibrary}>
                    <Text style={styles.buttonText}>➕ Adicionar à Biblioteca</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => setScreen("home")}>
                    <Text style={styles.buttonText}>⬅ Voltar para Home</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        fontSize: 20,
        color: 'gray',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#e8fffe',
        padding: 20,
    },
    gameImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    gameTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginVertical: 15,
    },
    infoText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        marginVertical: 5,
    },
    descriptionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        marginTop: 20,
    },
    descriptionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
    },
    trailerButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    libraryButton: {
        backgroundColor: '#00D46E',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    backButton: {
        backgroundColor: '#FF3B30',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
