import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';

// 1. Definimos la estructura de los datos que esperamos
interface GitHubUser {
  name: string;
  bio: string;
  public_repos: number;
  avatar_url: string;
}

export default function App() {
  // 2. Le decimos al estado que guardará un objeto de tipo GitHubUser o null
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchGitHubUser = async () => {
    try {
      setLoading(true);

      const response = await fetch('https://api.github.com/users/octocat');
      
      // 3. Tipamos la respuesta del JSON
      const data: GitHubUser = await response.json();

      setUserData(data);
    } catch (error) {
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GitHub Explorer TS</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <View style={styles.card}>
          {userData ? (
            <View style={styles.profileContainer}>
              {/* Ahora podemos usar avatar_url con seguridad */}
              <Image source={{ uri: userData.avatar_url }} style={styles.avatar} />
              
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.bio}>{userData.bio || "Sin biografía"}</Text>
              
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Repos: {userData.public_repos}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.placeholder}>Presiona el botón para cargar</Text>
          )}
        </View>
      )}

      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.5 }]} 
        onPress={fetchGitHubUser}
        disabled={loading} // Evitamos múltiples clics mientras carga
      >
        <Text style={styles.buttonText}>
          {loading ? 'Cargando...' : 'Obtener Octocat'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#1c1e21' },
  card: { width: '100%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, minHeight: 200, justifyContent: 'center' },
  profileContainer: { alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  bio: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 10 },
  badge: { backgroundColor: '#e7f3ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#007AFF', fontWeight: '600' },
  placeholder: { color: '#999', fontStyle: 'italic' },
  button: { marginTop: 30, backgroundColor: '#007AFF', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12, width: '100%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});