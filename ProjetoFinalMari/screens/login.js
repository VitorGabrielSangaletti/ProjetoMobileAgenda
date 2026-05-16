import { useState, useEffect } from 'react';
import {
  StyleSheet, TextInput, View, Image, Text,
  TouchableOpacity, ImageBackground, ActivityIndicator, Alert,
} from 'react-native';
import { buscarUsuario, cadastrarUsuario, validarLogin } from '../utils/storage';

export default function Login({ navigation }) {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha]             = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [primeiroCadastro, setPrimeiroCadastro] = useState(false);
  const [carregando, setCarregando]   = useState(true);

  // Verifica se já existe um usuário cadastrado
  useEffect(() => {
    (async () => {
      const usuario = await buscarUsuario();
      setPrimeiroCadastro(!usuario);
      setCarregando(false);
    })();
  }, []);

  async function aoEntrar() {
    if (!nomeUsuario.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha usuário e senha.');
      return;
    }

    if (primeiroCadastro) {
      // Primeiro acesso — cadastra o usuário
      if (senha !== confirmaSenha) {
        Alert.alert('Erro', 'As senhas não coincidem.');
        return;
      }
      if (senha.length < 4) {
        Alert.alert('Erro', 'A senha deve ter ao menos 4 caracteres.');
        return;
      }
      await cadastrarUsuario(nomeUsuario.trim(), senha);
      navigation.replace('home');
    } else {
      // Acesso normal — valida credenciais
      const resultado = await validarLogin(nomeUsuario.trim(), senha);
      if (resultado.sucesso) {
        navigation.replace('home');
      } else {
        Alert.alert('Acesso negado', 'Usuário ou senha incorretos.');
      }
    }
  }

  if (carregando) {
    return (
      <View style={styles.fundoCarregando}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <ImageBackground
      style={styles.fundo}
      resizeMode="cover"
      source={require('../assets/floresta.jpg')}
      blurRadius={8}
    >
      <View style={styles.container}>
        <Image source={require('../assets/guest.png')} style={styles.logo} />

        <Text style={styles.titulo}>
          {primeiroCadastro ? 'Criar conta' : 'Bem-vindo'}
        </Text>

        {primeiroCadastro && (
          <Text style={styles.subtitulo}>
            Primeiro acesso! Crie seu usuário e senha.
          </Text>
        )}

        <TextInput
          placeholder="Usuário"
          placeholderTextColor="#aaa"
          style={styles.campo}
          value={nomeUsuario}
          onChangeText={setNomeUsuario}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#aaa"
          style={styles.campo}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {primeiroCadastro && (
          <TextInput
            placeholder="Confirmar senha"
            placeholderTextColor="#aaa"
            style={styles.campo}
            value={confirmaSenha}
            onChangeText={setConfirmaSenha}
            secureTextEntry
          />
        )}

        <TouchableOpacity style={styles.botao} onPress={aoEntrar}>
          <Text style={styles.textoBotao}>
            {primeiroCadastro ? 'Criar conta' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        {!primeiroCadastro && (
          <Text style={styles.rodape}>Esqueceu a senha?</Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fundoCarregando: {
    flex: 1,
    backgroundColor: '#0d0f12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fundo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
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
    marginBottom: 8,
  },
  subtitulo: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
  },
  campo: {
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
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rodape: {
    color: '#aaa',
    marginTop: 20,
  },
});

