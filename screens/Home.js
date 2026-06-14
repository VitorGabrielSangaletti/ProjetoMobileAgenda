import { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Agenda } from 'react-native-calendars'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { signOut } from 'firebase/auth'
import { auth } from '../utils/firebase'

import { loadEvents, addEvent, updateEvent, deleteEvent } from '../utils/storage'
import { buscarAlertas, pesquisarEventos, construirDatasMarcadas, temaAgenda } from '../utils/constantes'
import styles from '../styles/homeStyles'

import BarraSuperior from '../components/BarraSuperior'
import BannerAlerta from '../components/BannerAlerta'
import ModalAlertas from '../components/ModalAlertas'
import EventModal from './EventModal'
import { ItemEvento, ResultadoPesquisa } from '../components/ItemEvento'

export default function Home({ navigation }) {
  const [eventos, setEventos] = useState({})                 
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0])
  const [modalVisivel, setModalVisivel] = useState(false)     
  const [eventoEditando, setEventoEditando] = useState(null)  
  const [alertaVisivel, setAlertaVisivel] = useState(false)   
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [modoPesquisa, setModoPesquisa] = useState(false)

  // true só quando esta aba está em foco — usado para não mostrar o popup
  // de alerta quando o usuário está em outra aba (Notas, Hábitos, etc)
  const telaPrincialAtiva = useIsFocused()

  // Roda toda vez que a tela ganha foco (ex: voltar pra essa aba)
  // Recarrega os eventos do Firestore e verifica se precisa mostrar alerta
  useFocusEffect(useCallback(() => {
    loadEvents().then(dados => {
      setEventos(dados)
      if (buscarAlertas(dados).length > 0) setAlertaVisivel(true)
    })
  }, []))

  // Se os eventos mudarem (ex: editou a prioridade) e não houver mais
  // nenhum alerta pendente, fecha o popup automaticamente
  useEffect(() => {
    if (buscarAlertas(eventos).length === 0) setAlertaVisivel(false)
  }, [eventos])

  // Se já existe eventoEditando, atualiza; senão cria um novo
  async function salvarEvento(dados) {
    const novo = eventoEditando
      ? await updateEvent(dataSelecionada, dados.id, dados)
      : await addEvent(dataSelecionada, dados)
    setEventos(novo)
    setModalVisivel(false)
    setEventoEditando(null)
  }

  // Pede confirmação antes de excluir, igual outros apps fazem
  function excluirEvento(id) {
    Alert.alert('Excluir evento', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        const novo = await deleteEvent(dataSelecionada, id)
        setEventos(novo)
        setModalVisivel(false)
        setEventoEditando(null)
      }},
    ])
  }

  // Abre o modal para editar um evento existente
  // O parâmetro "data" é usado quando o evento vem da busca (data diferente da selecionada)
  function abrirEdicao(evento, data) {
    setDataSelecionada(data || dataSelecionada)
    setEventoEditando(evento)
    setModalVisivel(true)
  }

  const alertas = buscarAlertas(eventos)

  // O componente Agenda espera um objeto { "2026-06-13": [...eventos] }
  // com a propriedade "height" em cada item para calcular o layout
  const itensAgenda = Object.fromEntries(
    Object.entries(eventos).map(([data, evs]) => [data, evs.map(e => ({ ...e, height: 60 }))])
  )

  return (
    <SafeAreaView style={styles.container}>
      <BarraSuperior
        modoPesquisa={modoPesquisa}
        aoTogglePesquisa={() => { setModoPesquisa(v => !v); setTermoPesquisa('') }}
        aoSair={async () => {
          await signOut(auth)  // desloga do Firebase
          navigation.getParent().replace('Login')  // getParent() porque essa tela está dentro do Bottom Tab
        }}
      />

      <BannerAlerta quantidade={alertas.length} aoPress={() => setAlertaVisivel(true)} />

      {/* Alterna entre o calendário e a lista de resultados da busca */}
      {modoPesquisa ? (
        <ResultadoPesquisa
          termoPesquisa={termoPesquisa}
          aoAlterarTermo={setTermoPesquisa}
          resultados={pesquisarEventos(eventos, termoPesquisa)}
          aoSelecionarItem={item => abrirEdicao(item, item.data)}
        />
      ) : (
        <Agenda
          items={itensAgenda}
          selected={dataSelecionada}
          markedDates={construirDatasMarcadas(eventos, dataSelecionada)}
          onDayPress={dia => setDataSelecionada(dia.dateString)}
          theme={temaAgenda}
          renderItem={item => <ItemEvento item={item} aoPress={() => abrirEdicao(item)} />}
          renderEmptyDate={() => (
            <View style={styles.semEvento}>
              <Text style={styles.textoSemEvento}>Sem eventos</Text>
            </View>
          )}
        />
      )}

      {/* Botão flutuante para criar um novo evento na data selecionada */}
      <TouchableOpacity style={styles.fab} onPress={() => { setEventoEditando(null); setModalVisivel(true) }}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      <EventModal
        visible={modalVisivel}
        date={dataSelecionada}
        event={eventoEditando}
        onSave={salvarEvento}
        onDelete={excluirEvento}
        onClose={() => { setModalVisivel(false); setEventoEditando(null) }}
      />

      {/* Só mostra o popup se houver alerta E a aba Agenda estiver ativa */}
      <ModalAlertas visivel={alertaVisivel && telaPrincialAtiva} alertas={alertas} aoFechar={() => setAlertaVisivel(false)} />
    </SafeAreaView>
  )
}