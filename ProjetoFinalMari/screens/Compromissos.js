import { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { loadEvents } from '../utils/storage'
import { PRIORIDADE } from '../utils/constantes'
import styles from '../styles/compromissosStyles'

function listarCompromissos(eventos) {
  const agora = Date.now()
  const lista = []

  Object.entries(eventos).forEach(([data, evs]) => {
    ;(evs || []).forEach(ev => {
      const [ano, mes, dia] = data.split('-').map(Number)
      const [hora, minuto] = (ev.hora || '00:00').split(':').map(Number)
      const timestamp = new Date(ano, mes - 1, dia, hora, minuto).getTime()
      if (timestamp > agora) lista.push({ ...ev, data, timestamp })
    })
  })

  return lista.sort((a, b) => a.timestamp - b.timestamp)
}

function tempoRestante(timestamp) {
  const diff = timestamp - Date.now()
  if (diff <= 0) return 'Agora!'

  const dias    = Math.floor(diff / (1000 * 60 * 60 * 24))
  const horas   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const segundos = Math.floor((diff % (1000 * 60)) / 1000)

  if (dias > 0)  return `${dias}d ${horas}h ${minutos}m`
  if (horas > 0) return `${horas}h ${minutos}m ${segundos}s`
  return `${minutos}m ${segundos}s`
}

function CardCompromisso({ item, countdown }) {
  const p = PRIORIDADE[item.prioridade] || PRIORIDADE.normal
  const chegando = item.timestamp - Date.now() < 24 * 60 * 60 * 1000

  return (
    <View style={[styles.card, { borderLeftColor: p.cor }]}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo} numberOfLines={1}>{item.titulo}</Text>
        <Text style={[styles.countdown, chegando && styles.countdownUrgente]}>{countdown}</Text>
      </View>
      <View style={styles.linha}>
        <Text style={styles.data}>📅 {item.data}</Text>
        {item.hora ? <Text style={styles.hora}>⏰ {item.hora}</Text> : null}
      </View>
      {item.descricao ? <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text> : null}
      <Text style={{ color: p.cor, fontSize: 11, marginTop: 8 }}>{p.rotulo}</Text>
    </View>
  )
}

export default function Compromissos() {
  const [compromissos, setCompromissos] = useState([])
  const [tick, setTick] = useState(0)

  useFocusEffect(useCallback(() => {
    let ativo = true
    loadEvents().then(dados => {
      if (ativo) setCompromissos(listarCompromissos(dados))
    })
    return () => { ativo = false }
  }, []))

  useEffect(() => {
    const intervalo = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloTela}>📋 Compromissos</Text>
        <Text style={styles.subtituloTela}>Seus próximos eventos</Text>
      </View>

      <FlatList
        data={compromissos}
        keyExtractor={item => item.id + item.data}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.textoVazio}>🎉</Text>
            <Text style={styles.textoVazio}>Nenhum compromisso futuro!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CardCompromisso item={item} countdown={tempoRestante(item.timestamp)} />
        )}
      />
    </SafeAreaView>
  )
}
