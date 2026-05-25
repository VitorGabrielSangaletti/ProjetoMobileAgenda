import { useState, useEffect } from 'react'
import { TextInput, View, Image, Text, TouchableOpacity, ImageBackground, ActivityIndicator, Alert } from 'react-native'
import { buscarUsuario, cadastrarUsuario, validarLogin } from '../utils/storage'
import styles from '../styles/loginStyles'

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [primeiroCadastro, setPrimeiroCadastro] = useState(false)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    buscarUsuario().then(u => {
      setPrimeiroCadastro(!u)
      setCarregando(false)
    })
  }, [])

  async function entrar() {
    if (!usuario.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha usuário e senha.')
      return
    }

    if (primeiroCadastro) {
      if (senha !== confirmaSenha) return Alert.alert('Erro', 'As senhas não coincidem.')
      if (senha.length < 4) return Alert.alert('Erro', 'Senha muito curta, mínimo 4 caracteres.')
      await cadastrarUsuario(usuario.trim(), senha)
      navigation.replace('home')
    } else {
      const resultado = await validarLogin(usuario.trim(), senha)
      if (resultado.sucesso) {
        navigation.replace('home')
      } else {
        Alert.alert('Acesso negado', 'Usuário ou senha incorretos.')
      }
    }
  }

  if (carregando) {
    return (
      <View style={styles.fundoCarregando}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    )
  }

  return (
    <ImageBackground style={styles.fundo} resizeMode="cover" source={require('../assets/floresta.jpg')} blurRadius={8}>
      <View style={styles.container}>
        <Image source={require('../assets/guest.png')} style={styles.logo} />

        <Text style={styles.titulo}>{primeiroCadastro ? 'Criar conta' : 'Bem-vindo'}</Text>

        {primeiroCadastro && (
          <Text style={styles.subtitulo}>Primeiro acesso! Crie seu usuário e senha.</Text>
        )}

        <TextInput
          placeholder="Usuário"
          placeholderTextColor="#aaa"
          style={styles.campo}
          value={usuario}
          onChangeText={setUsuario}
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

        <TouchableOpacity style={styles.botao} onPress={entrar}>
          <Text style={styles.textoBotao}>{primeiroCadastro ? 'Criar conta' : 'Entrar'}</Text>
        </TouchableOpacity>

        {!primeiroCadastro && <Text style={styles.rodape}>Esqueceu a senha?</Text>}
      </View>
    </ImageBackground>
  )
}
