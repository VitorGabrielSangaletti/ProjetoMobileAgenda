import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { loadEvents } from '../utils/storage';
import { PRIORIDADE } from '../utils/constantes';

// ─── Monta lista ordenada de todos os eventos futuros ─────────────────────────
function listarCompromissos(eventos) {
  const agora = Date.now();
  const lista = [];

  Object.entries(eventos).forEach(([data, evs]) => {
    (evs || []).forEach(ev => {
      const [ano, mes, dia] = data.split('-').map(Number);
      const [hora, minuto]  = (ev.hora || '00:00').split(':').map(Number);
      const timestamp = new Date(ano, mes - 1, dia, hora, minuto, 0, 0).getTime();
      if (timestamp > agora) lista.push({ ...ev, data, timestamp });
    });
  });

  return lista.sort((a, b) => a.timestamp - b.timestamp);
}

// ─── Formata o tempo restante em texto legível ────────────────────────────────
function formatarTempoRestante(timestamp) {
  const diff = timestamp - Date.now();
  if (diff <= 0) return 'Agora!';

  const dias    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diff % (1000 * 60)) / 1000);

  if (dias > 0)  return `${dias}d ${horas}h ${minutos}m`;
  if (horas > 0) return `${horas}h ${minutos}m ${segundos}s`;
  return `${minutos}m ${segundos}s`;
}

// ─── Card de cada compromisso ─────────────────────────────────────────────────
function CardCompromisso({ item, tempoRestante }) {
  const p = PRIORIDADE[item.prioridade] || PRIORIDADE.normal;
  const urgente = item.timestamp - Date.now() < 24 * 60 * 60 * 1000;

  return (
    <View style={[styles.card, { borderLeftColor: p.cor }]}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo} numberOfLines={1}>{item.titulo}</Text>
        <Text style={[styles.countdown, urgente && styles.countdownUrgente]}>
          {tempoRestante}
        </Text>
      </View>

      <View style={styles.linha}>
        <Text style={styles.data}>📅 {item.data}</Text>
        {item.hora ? <Text style={styles.hora}>⏰ {item.hora}</Text> : null}
      </View>

      {item.descricao ? (
        <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>
      ) : null}

      <Text style={{ color: p.cor, fontSize: 11, marginTop: 8 }}>{p.rotulo}</Text>
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function Compromissos({ navigation }) {
  const [compromissos, setCompromissos] = useState([]);
  const [agora, setAgora]               = useState(Date.now());

  // Carrega eventos ao focar na tela
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const eventos = await loadEvents();
        setCompromissos(listarCompromissos(eventos));
      })();
    }, [])
  );

  // Tick a cada segundo pra atualizar o countdown
  useEffect(() => {
    const intervalo = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <Text style={styles.iconeVoltar}>←</Text>
        </TouchableOpacity>
        <Text style={styles.tituloTela}>📋 Compromissos</Text>
      </View>

      {/* Lista */}
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
          <CardCompromisso
            item={item}
            tempoRestante={formatarTempoRestante(item.timestamp)}
          />
        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0f12' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#141618',
    borderBottomWidth: 1,
    borderBottomColor: '#1e2127',
    gap: 12,
  },
  botaoVoltar: { padding: 4 },
  iconeVoltar: { fontSize: 22, color: '#4f46e5', fontWeight: 'bold' },
  tituloTela:  { fontSize: 18, fontWeight: 'bold', color: '#e8e8e8' },

  // Lista
  lista: { padding: 16, paddingBottom: 40 },
  vazio: { alignItems: 'center', marginTop: 80, gap: 8 },
  textoVazio: { color: '#555', fontSize: 16 },

  // Card
  card: {
    backgroundColor: '#141618',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    elevation: 2,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titulo: { color: '#e8e8e8', fontSize: 15, fontWeight: 'bold', flex: 1, marginRight: 8 },
  countdown: { color: '#4f46e5', fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },
  countdownUrgente: { color: '#ef4444' },
  linha:    { flexDirection: 'row', gap: 16, marginBottom: 4 },
  data:     { color: '#666', fontSize: 12 },
  hora:     { color: '#666', fontSize: 12 },
  descricao: { color: '#555', fontSize: 13, marginTop: 4 },
});
