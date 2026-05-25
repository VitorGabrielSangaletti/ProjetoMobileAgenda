import { Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { PRIORIDADE } from '../utils/constantes'
import { modalAlertasStyles as styles } from '../styles/componentStyles'

export default function ModalAlertas({ visivel, alertas, aoFechar }) {
  return (
    <Modal visible={visivel} transparent animationType="fade">
      <View style={styles.fundo}>
        
        <View style={styles.caixa}>
        
          <Text style={styles.titulo}>🔔 Alertas</Text>
          <Text style={styles.subtitulo}>Eventos nas próximas 24 horas:</Text>
        
          <ScrollView style={{ maxHeight: 300 }}>
            {alertas.map(ev => {
              const p = PRIORIDADE[ev.prioridade] || PRIORIDADE.normal
              return (
                <View key={ev.id + ev.data} style={[styles.item, { borderLeftColor: p.cor }]}>
                  <Text style={styles.itemTitulo}>{ev.titulo}</Text>
                  <Text style={styles.itemMeta}>{ev.data}{ev.hora ? ' às ' + ev.hora : ''}</Text>
                  <Text style={{ color: p.cor, fontSize: 11 }}>{p.rotulo}</Text>
                </View>
              )
        
        })}
          </ScrollView>
        
          <TouchableOpacity style={styles.botaoFechar} onPress={aoFechar}>
            <Text style={styles.textoFechar}>Fechar</Text>
          </TouchableOpacity>
        
        </View>
      </View>
    </Modal>
  )
}
