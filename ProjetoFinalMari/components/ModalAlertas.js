import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { PRIORIDADE } from '../utils/constantes';

export default function ModalAlertas({ visivel, alertas, aoFechar }) {
  return (
    <Modal visible={visivel} transparent animationType="fade">
      <View style={styles.fundo}>
        <View style={styles.caixa}>
          <Text style={styles.titulo}>🔔 Alertas</Text>
          <Text style={styles.subtitulo}>Eventos nas próximas 24 horas:</Text>
          <ScrollView style={{ maxHeight: 300 }}>
            {alertas.map(ev => {
              const p = PRIORIDADE[ev.prioridade] || PRIORIDADE.normal;
              return (
                <View key={ev.id + ev.data} style={[styles.item, { borderLeftColor: p.cor }]}>
                  <Text style={styles.itemTitulo}>{ev.titulo}</Text>
                  <Text style={styles.itemMeta}>{ev.data}{ev.hora ? ' às ' + ev.hora : ''}</Text>
                  <Text style={{ color: p.cor, fontSize: 11 }}>{p.rotulo}</Text>
                </View>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.botaoFechar} onPress={aoFechar}>
            <Text style={styles.textoFechar}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  caixa:       { backgroundColor: '#141618', borderRadius: 20, padding: 24, width: '100%', borderWidth: 1, borderColor: '#ef4444' },
  titulo:      { fontSize: 22, fontWeight: 'bold', color: '#e8e8e8', marginBottom: 4 },
  subtitulo:   { fontSize: 13, color: '#888', marginBottom: 16 },
  item:        { backgroundColor: '#1e2127', borderRadius: 10, padding: 14, marginBottom: 10, borderLeftWidth: 3 },
  itemTitulo:  { color: '#e8e8e8', fontWeight: 'bold', fontSize: 14 },
  itemMeta:    { color: '#888', fontSize: 12, marginTop: 3 },
  botaoFechar: { backgroundColor: '#1e2127', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16, borderWidth: 1, borderColor: '#2a2d35' },
  textoFechar: { color: '#888', fontWeight: '600' },
});
