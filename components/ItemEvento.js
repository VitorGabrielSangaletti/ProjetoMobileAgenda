import { View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native'
import { PRIORIDADE } from '../utils/constantes'
import { itemEventoStyles as styles } from '../styles/componentStyles'

export function ItemEvento({ item, aoPress }) {
  const p = PRIORIDADE[item.prioridade] || PRIORIDADE.normal
  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: p.cor }]} onPress={aoPress}>
      <View style={styles.linha}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        {item.hora ? <Text style={styles.hora}>⏰ {item.hora}</Text> : null}
      </View>
      {item.descricao ? <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text> : null}
      <Text style={{ color: p.cor, fontSize: 11, marginTop: 6 }}>{p.rotulo}</Text>
    </TouchableOpacity>
  )
}

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
          
          const p = PRIORIDADE[item.prioridade] || PRIORIDADE.normal
          
          return (
            <TouchableOpacity style={[styles.itemResultado, { borderLeftColor: p.cor }]} onPress={() => aoSelecionarItem(item)}>
              <Text style={styles.dataResultado}>{item.data}</Text>
              <Text style={styles.tituloResultado}>{item.titulo}</Text>
              {item.hora ? <Text style={styles.horaResultado}>⏰ {item.hora}</Text> : null}
              {item.descricao ? <Text style={styles.descResultado} numberOfLines={1}>{item.descricao}</Text> : null}
              <Text style={{ color: p.cor, fontSize: 11, marginTop: 4 }}>{p.rotulo}</Text>
            </TouchableOpacity>
          )
        }}
      />
    </>
  )
}
