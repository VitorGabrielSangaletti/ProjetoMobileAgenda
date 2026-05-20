import React from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet } from 'react-native';
import { PRIORIDADE } from '../utils/constantes';

// ─── Card de evento na agenda ─────────────────────────────────────────────────
export function ItemEvento({ item, aoPress }) {
  const p = PRIORIDADE[item.prioridade] || PRIORIDADE.normal;
  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: p.cor }]} onPress={aoPress}>
      <View style={styles.linha}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        {item.hora ? <Text style={styles.hora}>⏰ {item.hora}</Text> : null}
      </View>
      {item.descricao ? <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text> : null}
      <Text style={{ color: p.cor, fontSize: 11, marginTop: 6 }}>{p.rotulo}</Text>
    </TouchableOpacity>
  );
}

// ─── Lista de resultados da pesquisa ─────────────────────────────────────────
export function ResultadoPesquisa({ termoPesquisa, aoAlterarTermo, resultados, aoSelecionarItem }) {
  return (
    <>
      <View style={styles.campoPesquisa}>
        <TextInput
          style={styles.inputPesquisa}
          placeholder="Buscar por data, título ou descrição..."
          placeholderTextColor="#555"
          value={termoPesquisa}
          onChangeText={aoAlterarTermo}
          autoFocus
        />
      </View>
      <FlatList
        style={styles.lista}
        data={resultados}
        keyExtractor={item => item.id + item.data}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum evento encontrado</Text>}
        renderItem={({ item }) => {
          const p = PRIORIDADE[item.prioridade] || PRIORIDADE.normal;
          return (
            <TouchableOpacity
              style={[styles.itemResultado, { borderLeftColor: p.cor }]}
              onPress={() => aoSelecionarItem(item)}
            >
              <Text style={styles.dataResultado}>{item.data}</Text>
              <Text style={styles.tituloResultado}>{item.titulo}</Text>
              {item.hora     ? <Text style={styles.horaResultado}>⏰ {item.hora}</Text> : null}
              {item.descricao ? <Text style={styles.descResultado} numberOfLines={1}>{item.descricao}</Text> : null}
              <Text style={{ color: p.cor, fontSize: 11, marginTop: 4 }}>{p.rotulo}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  // ItemEvento
  card:      { backgroundColor: '#141618', borderRadius: 12, padding: 16, marginRight: 10, marginTop: 14, borderLeftWidth: 4, elevation: 2 },
  linha:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo:    { color: '#e8e8e8', fontSize: 15, fontWeight: 'bold', flex: 1 },
  hora:      { color: '#888', fontSize: 12, marginLeft: 8 },
  descricao: { color: '#666', fontSize: 13, marginTop: 6 },

  // ResultadoPesquisa
  campoPesquisa: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#141618', borderBottomWidth: 1, borderBottomColor: '#1e2127' },
  inputPesquisa: { backgroundColor: '#1e2127', color: '#e8e8e8', borderRadius: 10, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#2a2d35' },
  lista:         { flex: 1, backgroundColor: '#0d0f12', paddingHorizontal: 16, paddingTop: 8 },
  vazio:         { color: '#555', textAlign: 'center', marginTop: 40, fontSize: 14 },
  itemResultado: { backgroundColor: '#141618', borderRadius: 10, padding: 14, marginBottom: 10, borderLeftWidth: 3 },
  dataResultado: { fontSize: 11, color: '#555', marginBottom: 3 },
  tituloResultado: { fontSize: 15, fontWeight: 'bold', color: '#e8e8e8' },
  horaResultado:   { fontSize: 12, color: '#888', marginTop: 3 },
  descResultado:   { fontSize: 13, color: '#666', marginTop: 3 },
});
