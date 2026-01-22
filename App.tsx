import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';



export default function App() {
  // 1. Definimos los estados para guardar la información
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 2. La función asíncrona principal
  const fetchGitHubUser = async () => {
    try {
      setLoading(true); // Empezamos a cargar

      // 3. Realizamos la petición (esperamos a que el servidor responda)
      const response = await fetch('https://api.github.com/users/ElNuevoAprendiz');
      
      // 4. Convertimos la respuesta a formato JSON (también toma tiempo)
      const data = await response.json();

      // 5. Guardamos el resultado en nuestro estado
      setUserData(data);
    } catch (error) {
      console.error("Algo salió mal:", error);
    } finally {
      // 6. Pase lo que pase, dejamos de cargar
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscador GitHub</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.card}>
          {userData ? (
            <>
              <Text style={styles.info}>Nombre: {userData.name}</Text>
              <Text style={styles.info}>Bio: {userData.bio}</Text>
              <Text style={styles.info}>Repos públicos: {userData.public_repos}</Text>
            </>
          ) : (
            <Text>Presiona el botón para obtener datos</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={fetchGitHubUser}>
        <Text style={styles.buttonText}>Cargar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 20, backgroundColor: 'white', borderRadius: 10, marginBottom: 20, elevation: 3 },
  info: { fontSize: 16, marginBottom: 5 },
  button: { backgroundColor: '#24292e', padding: 15, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});