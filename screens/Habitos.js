import { useState, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { loadHabitos, addHabito, deleteHabito, loadHabitosFeitos, toggleHabitoFeito } from '../utils/storage'
import { dataDeHoje } from '../utils/constantes'
import styles from '../styles/habitosStyles'

export default function Habitos() {
  const [habitos, setHabitos] = useState([])
  const [feitosHoje, setFeitosHoje] = useState([])
  const [novoHabito, setNovoHabito] = useState('')

  const hoje = dataDeHoje()

  useFocusEffect(useCallback(() => {
    loadHabitos().then(setHabitos)
    loadHabitosFeitos().then(feitos => setFeitosHoje(feitos[hoje] || []))
  }, []))

  async function adicionarHabito() {
    if (!novoHabito.trim()) return
    const novos = await addHabito({ id: Date.now().toString(), nome: novoHabito.trim() })
    setHabitos(novos)
    setNovoHabito('')
  }

  async function marcarFeito(id) {
    const feitos = await toggleHabitoFeito(hoje, id)
    setFeitosHoje(feitos[hoje] || [])
  }

  function removerHabito(id) {
    Alert.alert('Remover hábito', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: async () => {
        const novos = await deleteHabito(id)
        setHabitos(novos)
      }},
    ])
  }

  const totalFeitos = habitos.filter(h => feitosHoje.includes(h.id)).length

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloTela}>✅ Hábitos</Text>
        <Text style={styles.subtituloTela}>
          {habitos.length === 0 ? 'Adicione seus hábitos diários' : `${totalFeitos} de ${habitos.length} feitos hoje`}
        </Text>
      </View>

      <FlatList
        data={habitos}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.textoVazio}>🌱</Text>
            <Text style={styles.textoVazio}>Nenhum hábito cadastrado</Text>
          </View>
        }
        renderItem={({ item }) => {
          const feito = feitosHoje.includes(item.id)
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => marcarFeito(item.id)}
              onLongPress={() => removerHabito(item.id)}
            >
              <View style={[styles.checkbox, feito && styles.checkboxMarcado]}>
                {feito && <Text style={styles.checkboxTexto}>✓</Text>}
              </View>
              <Text style={[styles.nomeHabito, feito && styles.nomeHabitoFeito]}>
                {item.nome}
              </Text>
            </TouchableOpacity>
          )
        }}
      />

      <View style={styles.novoContainer}>
        <TextInput
          style={styles.campoNovo}
          placeholder="Novo hábito... (ex: beber água)"
          placeholderTextColor="#555"
          value={novoHabito}
          onChangeText={setNovoHabito}
          onSubmitEditing={adicionarHabito}
        />
        <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarHabito}>
          <Text style={styles.textoAdicionar}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
