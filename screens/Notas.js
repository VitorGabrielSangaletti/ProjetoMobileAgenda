import { useState, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { loadNotas, addNota, updateNota, deleteNota } from '../utils/storage'
import styles from '../styles/notasStyles'

const TAMANHOS = [14, 16, 18, 22, 26]

function NotaEditor({ nota, onSalvar, onExcluir, onFechar }) {
  const [titulo, setTitulo] = useState(nota?.titulo || '')
  const [texto, setTexto] = useState(nota?.texto || '')
  const [tamanhoFonte, setTamanhoFonte] = useState(nota?.tamanhoFonte || 16)
  const [negrito, setNegrito] = useState(nota?.negrito || false)

  function aumentarFonte() {
    const indice = TAMANHOS.indexOf(tamanhoFonte)
    if (indice < TAMANHOS.length - 1) setTamanhoFonte(TAMANHOS[indice + 1])
  }

  function diminuirFonte() {
    const indice = TAMANHOS.indexOf(tamanhoFonte)
    if (indice > 0) setTamanhoFonte(TAMANHOS[indice - 1])
  }

  function salvar() {
    if (!titulo.trim() && !texto.trim()) return onFechar()
    onSalvar({ titulo: titulo.trim() || 'Sem título', texto, tamanhoFonte, negrito })
  }

  return (
    <View style={styles.fundo}>
      <View style={styles.editorHeader}>
        <TouchableOpacity style={styles.botaoHeader} onPress={onFechar}>
          <Text style={styles.textoBotaoHeader}>Voltar</Text>
        </TouchableOpacity>

        {nota && (
          <TouchableOpacity style={styles.botaoHeader} onPress={onExcluir}>
            <Text style={styles.textoExcluirHeader}>Excluir</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.botaoHeader} onPress={salvar}>
          <Text style={styles.textoBotaoHeader}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.campoTitulo}
        placeholder="Título da nota"
        placeholderTextColor="#555"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={[
          styles.campoTexto,
          { fontSize: tamanhoFonte, fontWeight: negrito ? 'bold' : 'normal' },
        ]}
        placeholder="Escreva aqui..."
        placeholderTextColor="#555"
        value={texto}
        onChangeText={setTexto}
        multiline
      />

      <View style={styles.barraFormatacao}>
        <TouchableOpacity style={styles.botaoFormato} onPress={diminuirFonte}>
          <Text style={styles.textoBotaoFormato}>A-</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoFormato} onPress={aumentarFonte}>
          <Text style={styles.textoBotaoFormato}>A+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoFormato, negrito && styles.botaoFormatoAtivo]}
          onPress={() => setNegrito(v => !v)}
        >
          <Text style={styles.textoBotaoFormato}>B</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function Notas() {
  const [notas, setNotas] = useState([])
  const [notaAberta, setNotaAberta] = useState(null)
  const [criandoNova, setCriandoNova] = useState(false)

  useFocusEffect(useCallback(() => {
    loadNotas().then(setNotas)
  }, []))

  async function salvarNota(dados) {
    let novas
    if (notaAberta) {
      novas = await updateNota(notaAberta.id, dados)
    } else {
      novas = await addNota({ id: Date.now().toString(), ...dados, criadoEm: new Date().toISOString() })
    }
    setNotas(novas)
    setNotaAberta(null)
    setCriandoNova(false)
  }

  function excluirNota() {
    Alert.alert('Excluir nota', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        const novas = await deleteNota(notaAberta.id)
        setNotas(novas)
        setNotaAberta(null)
      }},
    ])
  }

  if (notaAberta || criandoNova) {
    return (
      <NotaEditor
        nota={notaAberta}
        onSalvar={salvarNota}
        onExcluir={excluirNota}
        onFechar={() => { setNotaAberta(null); setCriandoNova(false) }}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloTela}>📝 Anotações</Text>
        <Text style={styles.subtituloTela}>Suas notas pessoais</Text>
      </View>

      <FlatList
        data={notas}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.textoVazio}>📭</Text>
            <Text style={styles.textoVazio}>Nenhuma anotação ainda</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setNotaAberta(item)}>
            <Text style={styles.cardTitulo}>{item.titulo}</Text>
            <Text style={styles.cardTexto} numberOfLines={3}>{item.texto}</Text>
            <Text style={styles.cardData}>
              {new Date(item.criadoEm).toLocaleDateString('pt-BR')}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setCriandoNova(true)}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
