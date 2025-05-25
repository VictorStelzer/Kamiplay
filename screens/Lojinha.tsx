import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Animated, StyleSheet, ScrollView } from "react-native";
import Novidade from "./novidades";
import Promocoes from "./promocoes";
import Jogos from "./jogos";
import axios from "axios";

type Props = {
    setScreen: (screen: string) => void;
};

export default function Loja({ setScreen }: Props) {
    const [activeTab, setActiveTab] = useState("novidade");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    const API_KEY = "639e9921f4054ca28acde410a0278e64";
    const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}`;

    function handleSearch() {
        axios.get(`${API_URL}&search=${searchQuery}`)
            .then(response => setSearchResults(response.data.results))
            .catch(error => console.error("Erro ao buscar jogos:", error));
    }

    function toggleInput() {
        setShowInput(!showInput);
        Animated.timing(fadeAnim, {
            toValue: showInput ? 0 : 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TouchableOpacity onPress={toggleInput}>
                    <Image source={require('@/assets/Lupa.png')} style={styles.searchIcon} resizeMode="contain" />
                </TouchableOpacity>

                {showInput && (
                    <Animated.View style={{ opacity: fadeAnim, marginLeft: 10 }}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Pesquisar jogo..."
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                        />
                    </Animated.View>
                )}
            </View>

          
            <View style={styles.tabsContainer}>
                <TouchableOpacity onPress={() => setActiveTab("novidade")} style={[styles.tab, activeTab === "novidade" && styles.activeTab]}>
                    <Text style={styles.tabText}>Novidade</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("promocoes")} style={[styles.tab, activeTab === "promocoes" && styles.activeTab]}>
                    <Text style={styles.tabText}>Promoções</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("jogos")} style={[styles.tab, activeTab === "jogos" && styles.activeTab]}>
                    <Text style={styles.tabText}>Jogos</Text>
                </TouchableOpacity>
            </View>

            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {activeTab === "novidade" && <Novidade />}
                {activeTab === "promocoes" && <Promocoes />}
                {activeTab === "jogos" && <Jogos />}
            </ScrollView>

   
            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => setScreen("home")} style={[styles.bottomIconContainer, activeTab === "home" && styles.activeIcon]}>
                    <Image source={require('@/assets/home.png')} style={styles.bottomIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setScreen("biblioteca")} style={[styles.bottomIconContainer, activeTab === "biblioteca" && styles.activeIcon]}>
                    <Image source={require('@/assets/livro.png')} style={styles.bottomIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setScreen("loja")} style={[styles.bottomIconContainer, activeTab === "loja" && styles.activeIcon]}>
                    <Image source={require('@/assets/loja.png')} style={styles.bottomIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F0F0' },
    searchContainer: { flexDirection: "row", alignItems: "center", padding: 10, justifyContent: "center" },
    searchIcon: { width: 30, height: 30 },
    searchInput: { borderBottomWidth: 1, width: 200, padding: 5 },
    
    tabsContainer: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, backgroundColor: "#ddd" },
    tab: { padding: 10, borderRadius: 10 },
    tabText: { fontSize: 18 },
    activeTab: { backgroundColor: "#FF3B30", borderRadius: 10, padding: 10 },

    scrollContainer: { paddingBottom: 80 },

    bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#3a453c', paddingVertical: 10, position: 'absolute', bottom: 0, width: '100%', borderRadius: 39 },
    bottomIconContainer: { padding: 10 },
    bottomIcon: { width: 47, height: 40 },
    activeIcon: { borderBottomWidth: 4, borderBottomColor: "#FF3B30" },
});
