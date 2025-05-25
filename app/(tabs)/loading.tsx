import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import missao from '@/screens/missao';
import Home from '@/screens/Home';

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const [screen, setScreen] = useState("loading"); 

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setShowButton(true);
                    return prev;
                }
                return prev + 10;
            });
        }, 300);
    }, []);


    if (screen === "Home") {
        return <Home />;
    }

    if (screen === "Home") {
        return <Home />;
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#073e52' }}>
            <Text style={{ fontSize: 34, fontWeight: 'bold', marginBottom: 20, marginTop: -590, position: "absolute" }}>
                Kamiplay
            </Text>

            <View style={{ width: 250, height: 30, backgroundColor: '#ccc', borderRadius: 10, overflow: 'hidden', position: "absolute", marginTop: -19 }}>
                <View style={{ width: `${progress}%`, height: '100%', backgroundColor: 'blue' }} />
            </View>

            <Image
                source={{ uri: 'https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif' }}
                style={{ width: 150, height: 200, marginTop: -250, position: "absolute" }}
            />

            {showButton && (
                <>
               
                
                    <TouchableOpacity
                        style={{ marginTop: 150, padding: 10, backgroundColor: 'green', borderRadius: 30 }}
                        onPress={() => setScreen("Home")}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>Ir para Início</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default LoadingScreen;
