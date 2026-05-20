import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { dataDeHoje } from '../utils/constantes';

export default function BarraSuperior({ modoPesquisa, aoTogglePesquisa, aoSair, aoAbrirCompromissos }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.nomeApp}>📓 Agenda</Text>
        <Text style={styles.rotuloHoje}>{dataDeHoje()}</Text>
      </View>
      <View style={styles.botoes}>
        <TouchableOpacity style={styles.botao} onPress={aoAbrirCompromissos}>
          <Text style={styles.icone}>📋</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={aoTogglePesquisa}>
          <Text style={styles.icone}>{modoPesquisa ? '✕' : '🔍'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={aoSair}>
          <Text style={styles.icone}>🚪</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#141618',
    borderBottomWidth: 1,
    borderBottomColor: '#1e2127',
  },
  nomeApp:    { fontSize: 20, fontWeight: 'bold', color: '#e8e8e8' },
  rotuloHoje: { fontSize: 12, color: '#555', marginTop: 2 },
  botoes:     { flexDirection: 'row', gap: 4 },
  botao:      { padding: 8 },
  icone:      { fontSize: 18, color: '#888' },
});
