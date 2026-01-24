import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  ActivityIndicator, Image, TextInput, Keyboard 
} from 'react-native';

// La interface se mantiene igual
interface GitHubUser {
  name: string;
  bio: string;
  public_repos: number;
  avatar_url: string;
}

export default function App() {
  // 1. Estado para el texto que escribe el usuario
  const [username, setUsername] = useState<string>('');
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Función de búsqueda asíncrona mejorada
  const searchUser = async () => {
    if (username.trim() === '') return; // No buscar si el campo está vacío

    try {
      setLoading(true);
      setError(null);
      Keyboard.dismiss(); // Oculta el teclado al buscar

      // Usamos "template literals" (las comillas invertidas ``) 
      // para meter la variable 'username' dentro de la URL
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (!response.ok) {
        throw new Error('Usuario no encontrado');
      }

      const data: GitHubUser = await response.json();
      setUserData(data);
    } catch (err: any) {
      setUserData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GitHub Finder</Text>

      {/* 3. El campo de entrada de texto */}
      <TextInput
        style={styles.input}
        placeholder="Escribe un usuario (ej: facebook)"
        value={username}
        onChangeText={setUsername} // Actualiza el estado con cada letra
        autoCapitalize="none"
      />

      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.5 }]} 
        onPress={searchUser}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Buscando...' : 'Buscar Usuario'}</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : userData ? (
          <View style={styles.profileContainer}>
            <Image source={{ uri: userData.avatar_url }} style={styles.avatar} />
            <Text style={styles.name}>{userData.name || username}</Text>
            <Text style={styles.bio}>{userData.bio || "Este usuario no tiene biografía"}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Repos: {userData.public_repos}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.placeholder}>Ingresa un nombre para ver su perfil</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#24292e', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center', minHeight: 250, justifyContent: 'center', elevation: 4 },
  profileContainer: { alignItems: 'center' },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold' },
  bio: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 10 },
  badge: { backgroundColor: '#007AFF', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  badgeText: { color: 'white', fontWeight: 'bold' },
  placeholder: { color: '#999' }
});