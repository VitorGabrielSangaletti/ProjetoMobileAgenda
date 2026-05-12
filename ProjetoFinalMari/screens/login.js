import { useState } from 'react';
import { StyleSheet, TextInput, View, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';

export default function Login({ navigation }) {

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  return (
    
<ImageBackground style={styles.background}  
resizeMode="cover" 
source={require('../assets/floresta.jpg')}
blurRadius={8}>
    
    <View style={styles.container}>
      <Image 
        source={require('../assets/guest.png')} 
        style={styles.logo}
      />


      <Text style={styles.titulo}>Bem-vindo</Text>

      <TextInput
        placeholder='Usuário'
        placeholderTextColor="#aaa"
        style={styles.input}
        value={usuario}
        onChangeText={setUsuario}
      />

      <TextInput
        placeholder='Senha'
        placeholderTextColor="#aaa"
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />


      <TouchableOpacity 
        style={styles.botao}
        onPress={() => navigation.navigate('App')}
      >
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Esqueceu a senha?
      </Text>
        

    </View>
</ImageBackground>

  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,

  },

  titulo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  input: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  botao: {
    width: '100%',
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  footer: {
    color: '#aaa',
    marginTop: 20,
  },
  background: {
    flex: 1, 
    width: '125',
    height: '125%',
  }
});