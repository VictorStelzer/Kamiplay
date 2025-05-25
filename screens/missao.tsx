import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Alert } from 'react-native';


const API_KEY = '639e9921f4054ca28acde410a0278e64';

type Mission = {
    id: number;
    name: string;
    description: string;
    image: string;
};

export default function Missao({ setScreen }: { setScreen: (screen: string) => void }) {
    const [missions, setMissions] = useState<Mission[]>([]);

    useEffect(() => {
        async function fetchMissions() {
            try {
                const response = await axios.get(`https://api.rawg.io/api/games/3498/achievements?key=${API_KEY}`);
                setMissions(response.data.results);
            } catch (error) {
                console.error("Erro ao buscar missões:", error);
            }
        }
        fetchMissions();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>🎯 Missões</Text>

            {missions.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma missão encontrada!</Text>
            ) : (
                <View style={styles.missionsContainer}>
                    {missions.map((mission) => (
                        <TouchableOpacity key={mission.id} style={styles.missionCard} onPress={() => Alert.alert(mission.name, mission.description)}>
                            <Image source={{ uri: mission.image }} style={styles.missionImage} />
                            <Text style={styles.missionTitle}>{mission.name}</Text>
                        </TouchableOpacity>
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
    scrollContainer: { paddingBottom: 80, alignItems: 'center', backgroundColor: '#8E8E93' },
    title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10, color: 'white' },
    emptyText: { fontSize: 18, color: 'white', textAlign: 'center', marginTop: 20 },
    missionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 },
    missionCard: { backgroundColor: "#fff", padding: 10, borderRadius: 10, alignItems: 'center', width: 160 },
    missionImage: { width: 150, height: 100, borderRadius: 10 },
    missionTitle: { marginTop: 5, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'black' },
    backButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginTop: 20 },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});
