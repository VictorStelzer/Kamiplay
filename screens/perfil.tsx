import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_KEY = '639e9921f4054ca28acde410a0278e64';

type UserProfile = {
    name: string;
    nickname: string;
    profileImage: string;
    points: number;
    coins: number;
    trophies: number;
    relics: number;
    rank: number;
    onlineStatus: boolean;
    recentGames: { id: number; name: string; image: string }[];
};

export default function Perfil({ setScreen }: { setScreen: (screen: string) => void }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [onlineStatus, setOnlineStatus] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            const storedProfile = await AsyncStorage.getItem("userProfile");
            if (storedProfile) setProfile(JSON.parse(storedProfile));

            try {
                const response = await axios.get(`https://api.rawg.io/api/games/3498/achievements?key=${API_KEY}`);
                setProfile(prev => prev ? { ...prev, trophies: response.data.count } : null);
            } catch (error) {
                console.error("Erro ao buscar troféus:", error);
            }
        }
        fetchProfile();
    }, []);

    async function saveProfile() {
        const updatedProfile = {
            name,
            nickname,
            profileImage,
            points: profile?.points ?? 0,
            coins: profile?.coins ?? 0,
            trophies: profile?.trophies ?? 0,
            relics: profile?.relics ?? 0,
            rank: profile?.rank ?? 0,
            onlineStatus,
            recentGames: profile?.recentGames ?? []
        };

        await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        setProfile(updatedProfile);
        setEditing(false);
        Alert.alert("Perfil atualizado!", "Seu perfil foi salvo com sucesso.");
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>👤 Perfil do Usuário</Text>

            {editing ? (
                <View style={styles.editContainer}>
                    <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
                    <TextInput style={styles.input} placeholder="Nickname" value={nickname} onChangeText={setNickname} />
                    <TextInput style={styles.input} placeholder="URL da Foto" value={profileImage} onChangeText={setProfileImage} />

                    <TouchableOpacity style={styles.statusButton} onPress={() => setOnlineStatus(!onlineStatus)}>
                        <Text style={styles.buttonText}> Status: {onlineStatus ? "Online" : "Offline"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                        <Text style={styles.buttonText}>💾 Salvar Perfil</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.profileContainer}>
                    <Image 
                    source={{ uri: profile?.profileImage?.startsWith("https") ? profile.profileImage : "https://via.placeholder.com/200" }} 
                    style={styles.profileImage} 
                />
                    <Text style={styles.profileText}>Nome: {profile?.name ?? "Não definido"}</Text>
                    <Text style={styles.profileText}>Nickname: {profile?.nickname ?? "Não definido"}</Text>
                    <Text style={styles.profileText}> Status: {profile?.onlineStatus ? "Online" : "Offline"}</Text>
                    <Text style={styles.profileText}>🏆 Troféus: {profile?.trophies ?? 0}</Text>
                    <Text style={styles.profileText}> Relíquias: {profile?.relics ?? 0}</Text>
                    <Text style={styles.profileText}> Moedas: {profile?.coins ?? 0}</Text>
                    <Text style={styles.profileText}> Rank: {profile?.rank ?? "Não disponível"}</Text>

                    <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                        <Text style={styles.buttonText}>✏️ Editar Perfil</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text style={styles.title}>🎮 Jogos Recentes</Text>
            <View style={styles.gamesContainer}>
                {profile?.recentGames.map((game) => (
                    <View key={game.id} style={styles.gameCard}>
                        <Image source={{ uri: game.image }} style={styles.gameImage} />
                        <Text style={styles.gameTitle}>{game.name}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.backButton} onPress={() => setScreen("home")}>
                <Text style={styles.buttonText}>⬅ Voltar para Home</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { paddingBottom: 80, alignItems: 'center', backgroundColor: '#8E8E93' },
    title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10, color: 'white' },
    profileContainer: { alignItems: 'center', padding: 20 },
    profileImage: {width: 200, height: 200, borderRadius: 150, marginBottom: 10 },
    profileText: { fontSize: 18, color: 'white', textAlign: 'center', marginVertical: 5 },
    editContainer: { alignItems: 'center', padding: 20 },
    input: { backgroundColor: 'white', padding: 10, borderRadius: 8, width: 250, marginVertical: 5 },
    editButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginTop: 20 },
    statusButton: { backgroundColor: '#FFD700', padding: 15, borderRadius: 10, marginTop: 20 },
    saveButton: { backgroundColor: '#00D46E', padding: 15, borderRadius: 10, marginTop: 20 },
    backButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, marginTop: 20 },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    gamesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 },
    gameCard: { backgroundColor: "#fff", padding: 10, borderRadius: 10, alignItems: "center", width: 160 },
    gameImage: { width: 150, height: 100, borderRadius: 10 },
    gameTitle: { marginTop: 5, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'black' },
});
