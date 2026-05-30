import { useState } from 'react'
import { TextInput, View, Image, Text, TouchableOpacity, ImageBackground, Alert, ActivityIndicator } from 'react-native'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../utils/firebase'
import styles from '../styles/loginStyles'

export default function Login({ navigation }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [modoCadastro, setModoCadastro] = useState(false)

  async function entrar() {
    
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha email e senha.')
      return
    }

    setCarregando(true)
    try {
      if (modoCadastro) {
        await createUserWithEmailAndPassword(auth, email.trim(), senha)
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), senha)
      }
      navigation.replace('home')
    } catch (erro) {
      const mensagens = {
        'auth/invalid-email':'Email inválido.',
        'auth/user-not-found':'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/email-already-in-use': 'Este email já está cadastrado.',
        'auth/weak-password': 'Senha muito fraca, mínimo 6 caracteres.',
      }
      Alert.alert('Erro', mensagens[erro.code] || 'Algo deu errado, tenta de novo.')
    } finally {
      setCarregando(false)
    }
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

        <Text style={styles.titulo}>{modoCadastro ? 'Criar conta' : 'Bem-vindo'}</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.campo}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#aaa"
          style={styles.campo}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.botao} onPress={entrar} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.textoBotao}>{modoCadastro ? 'Cadastrar' : 'Entrar'}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModoCadastro(v => !v)}>
          <Text style={styles.rodape}>
            {modoCadastro ? 'Já tenho conta' : 'Criar conta'}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}
