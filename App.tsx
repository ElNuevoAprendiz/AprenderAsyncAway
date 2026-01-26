import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  ActivityIndicator, Image, TextInput, Keyboard 
} from 'react-native';
// Importamos el almacenamiento persistente
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GitHubUser {
  name: string;
  bio: string;
  public_repos: number;
  avatar_url: string;
}

export default function App() {
  const [username, setUsername] = useState<string>('');
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // --- NUEVO: CARGAR DATOS AL INICIAR ---
  // useEffect se ejecuta cuando la App se monta
  useEffect(() => {
    loadSavedUser();
  }, []);

  const loadSavedUser = async () => {
    try {
      // Intentamos leer de la memoria del teléfono
      const savedData = await AsyncStorage.getItem('@last_user');
      if (savedData !== null) {
        // Como guardamos texto, lo convertimos de vuelta a objeto
        setUserData(JSON.parse(savedData));
      }
    } catch (e) {
      console.error("Error cargando datos", e);
    }
  };

  // --- FUNCIÓN DE BÚSQUEDA ---
  const searchUser = async () => {
    if (username.trim() === '') return;

    try {
      setLoading(true);
      Keyboard.dismiss();

      const response = await fetch(`https://api.github.com/users/${username}`);
      const data: GitHubUser = await response.json();

      setUserData(data);

      // --- NUEVO: GUARDAR EN MEMORIA ---
      // AsyncStorage solo guarda strings, así que convertimos el objeto
      await AsyncStorage.setItem('@last_user', JSON.stringify(data));
      
    } catch (err) {
      alert("Usuario no encontrado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GitHub Finder + Memory</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario de GitHub"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity style={styles.button} onPress={searchUser}>
        <Text style={styles.buttonText}>Buscar y Guardar</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : userData ? (
          <View style={styles.profileContainer}>
            <Image source={{ uri: userData.avatar_url }} style={styles.avatar} />
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.bio}>{userData.bio}</Text>
            <Text>Repositorios Públicos: {userData.public_repos}</Text> 
          </View>
        ) : (
          <Text>No hay datos guardados</Text>
        )}
      </View>
      
      {/* Botón extra para probar el borrado */}
      <TouchableOpacity 
        onPress={async () => {
          await AsyncStorage.removeItem('@last_user');
          setUserData(null);
        }}
      >
        <Text style={{color: 'red', marginTop: 20}}>Borrar Memoria</Text>
      </TouchableOpacity>
    </View>
  );
}

// ... (Los estilos se mantienen similares al ejemplo anterior)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 40, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, width: '100%', marginBottom: 20, padding: 8 },
  button: { backgroundColor: '#000', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff' },
  card: { marginTop: 30, padding: 20, alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 15, width: '100%' },
  profileContainer: { alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 'bold' },
  bio: { textAlign: 'center', color: '#666' }
});