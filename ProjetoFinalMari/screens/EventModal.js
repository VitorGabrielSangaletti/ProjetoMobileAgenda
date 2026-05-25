import { useState, useEffect } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import styles from '../styles/eventModalStyles'

const PRIORIDADES = [
  { rotulo: 'Normal',     valor: 'normal',     cor: '#6b7280', fundo: '#1e2127' },
  { rotulo: 'Importante', valor: 'importante', cor: '#f59e0b', fundo: '#2a2010' },
  { rotulo: 'Urgente',    valor: 'urgente',    cor: '#ef4444', fundo: '#2a1010' },
]

export default function EventModal({ visible, date, event, onSave, onDelete, onClose }) {
  const editando = !!event

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [hora, setHora] = useState('')
  const [prioridade, setPrioridade] = useState('normal')

  useEffect(() => {
    if (event) {
      setTitulo(event.titulo || '')
      setDescricao(event.descricao || '')
      setHora(event.hora || '')
      setPrioridade(event.prioridade || 'normal')
    } else {
      setTitulo('')
      setDescricao('')
      setHora('')
      setPrioridade('normal')
    }
  }, [event, visible])

  function formatarHora(v) {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length <= 2 ? d : d.slice(0, 2) + ':' + d.slice(2)
  }

  function salvar() {
    if (!titulo.trim()) return
    onSave({
      id: event?.id || Date.now().toString(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      hora: hora.trim(),
      prioridade,
      criadoEm: event?.criadoEm || new Date().toISOString(),
    })
  }

  const prioAtual = PRIORIDADES.find(p => p.valor === prioridade)

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.fundo}>
        <View style={styles.painel}>
          <View style={styles.alca} />
          <Text style={styles.tituloPainel}>{editando ? '✏️ Editar evento' : '📌 Novo evento'}</Text>
          <Text style={styles.dataPainel}>{date}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.rotulo}>Título *</Text>
            <TextInput
              style={styles.campo}
              placeholder="Ex: Reunião com cliente"
              placeholderTextColor="#555"
              value={titulo}
              onChangeText={setTitulo}
            />

            <Text style={styles.rotulo}>Hora</Text>
            <TextInput
              style={[styles.campo, styles.campoPequeno]}
              placeholder="HH:MM"
              placeholderTextColor="#555"
              value={hora}
              keyboardType="numeric"
              onChangeText={v => setHora(formatarHora(v))}
              maxLength={5}
            />

            <Text style={styles.rotulo}>Descrição</Text>
            <TextInput
              style={[styles.campo, styles.campoMultilinha]}
              placeholder="Detalhes do evento..."
              placeholderTextColor="#555"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.rotulo}>Prioridade</Text>
            <View style={styles.fileiraPrioridade}>
              {PRIORIDADES.map(p => (
                <TouchableOpacity
                  key={p.valor}
                  style={[styles.botaoPrioridade, { borderColor: p.cor }, prioridade === p.valor && { backgroundColor: p.fundo }]}
                  onPress={() => setPrioridade(p.valor)}
                >
                  <Text style={[styles.textoPrioridade, { color: p.cor }]}>{p.rotulo}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.acoes}>
              <TouchableOpacity style={styles.botaoCancelar} onPress={onClose}>
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botaoSalvar, { backgroundColor: prioAtual.cor }]} onPress={salvar}>
                <Text style={styles.textoSalvar}>{editando ? 'Salvar' : 'Adicionar'}</Text>
              </TouchableOpacity>
            </View>

            {editando && (
              <TouchableOpacity style={styles.botaoExcluir} onPress={() => onDelete(event.id)}>
                <Text style={styles.textoExcluir}>🗑 Excluir evento</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
