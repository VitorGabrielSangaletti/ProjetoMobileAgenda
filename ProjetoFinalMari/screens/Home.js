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

  const telaPrincialAtiva = useIsFocused()

  useFocusEffect(useCallback(() => {
    loadEvents().then(dados => {
      setEventos(dados)
      if (buscarAlertas(dados).length > 0) setAlertaVisivel(true)
    })
  }, []))

  useEffect(() => {
    if (buscarAlertas(eventos).length === 0) setAlertaVisivel(false)
  }, [eventos])

  async function salvarEvento(dados) {
    const novo = eventoEditando
      ? await updateEvent(dataSelecionada, dados.id, dados)
      : await addEvent(dataSelecionada, dados)
    setEventos(novo)
    setModalVisivel(false)
    setEventoEditando(null)
  }

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

  function abrirEdicao(evento, data) {
    setDataSelecionada(data || dataSelecionada)
    setEventoEditando(evento)
    setModalVisivel(true)
  }

  const alertas = buscarAlertas(eventos)
  const itensAgenda = Object.fromEntries(
    Object.entries(eventos).map(([data, evs]) => [data, evs.map(e => ({ ...e, height: 60 }))])
  )

  return (
    <SafeAreaView style={styles.container}>
      <BarraSuperior
        modoPesquisa={modoPesquisa}
        aoTogglePesquisa={() => { setModoPesquisa(v => !v); setTermoPesquisa('') }}
        aoSair={async () => {
          await signOut(auth)
          navigation.getParent().replace('Login')
        }}
      />

      <BannerAlerta quantidade={alertas.length} aoPress={() => setAlertaVisivel(true)} />

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

      <ModalAlertas visivel={alertaVisivel && telaPrincialAtiva} alertas={alertas} aoFechar={() => setAlertaVisivel(false)} />
    </SafeAreaView>
  )
}
