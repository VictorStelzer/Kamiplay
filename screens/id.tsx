import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';


export default function IdScreen() {
  const [playstationID, setPlaystationID] = useState('');

  const handleConfirm = () => {
    console.log('PlayStation ID confirmado:', playstationID);
    // Aqui você pode redirecionar para outra tela ou fazer requisição à API
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digite ID</Text>
      <TextInput
        style={styles.input}
        placeholder="PlayStation ID"
        value={playstationID}
        onChangeText={setPlaystationID}
      />
      <Button title="Confirmar ID" onPress={handleConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#b08497',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: 250,
    height: 40,
    borderWidth: 3,
    borderColor: '#222',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
