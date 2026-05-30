import { View, Text, TouchableOpacity } from 'react-native'
import { barraSuperiorStyles as styles } from '../styles/componentStyles'
import { dataDeHoje } from '../utils/constantes'

export default function BarraSuperior({ modoPesquisa, aoTogglePesquisa, aoSair }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.nomeApp}>📓 Agenda</Text>
        <Text style={styles.rotuloHoje}>{dataDeHoje()}</Text>
      </View>
      <View style={styles.botoes}>
        <TouchableOpacity style={styles.botao} onPress={aoTogglePesquisa}>
          <Text style={styles.icone}>{modoPesquisa ? '✕' : '🔍'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={aoSair}>
          <Text style={styles.icone}>🚪</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
