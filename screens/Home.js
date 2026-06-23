//Imports


import { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Calendar } from 'react-native-calendars'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { signOut } from 'firebase/auth'
import { auth } from '../utils/firebase'

import { loadEvents, addEvent, updateEvent, deleteEvent } from '../utils/storage'
import { buscarAlertas, pesquisarEventos, construirDatasMarcadas, temaAgenda, PRIORIDADE } from '../utils/constantes'
import styles from '../styles/homeStyles'

import BarraSuperior from '../components/BarraSuperior'
import BannerAlerta from '../components/BannerAlerta'
import ModalAlertas from '../components/ModalAlertas'
import EventModal from './EventModal'
import { ItemEvento, ResultadoPesquisa } from '../components/ItemEvento'



export default function Home({ navigation }) {

  //Variaveis
  const [eventos, setEventos] = useState({})
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]) //Formato de data
  const [modalVisivel, setModalVisivel] = useState(false)
  const [eventoEditando, setEventoEditando] = useState(null)
  const [alertaVisivel, setAlertaVisivel] = useState(false)
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [modoPesquisa, setModoPesquisa] = useState(false)

  const telaPrincialAtiva = useIsFocused()

  //pop pup de alerta se tiver eventos 
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
      ? await updateEvent(dataSelecionada, dados.id, dados) //se tiver dados ele atualiza o evento
      : await addEvent(dataSelecionada, dados) //se nao ele cria um
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

  // Pega os eventos da data selecionada e se nao tiver ele retorna um array vazio
  const eventosDoDia = eventos[dataSelecionada] || []

  return (
    <SafeAreaView style={styles.container}>
      <BarraSuperior
        modoPesquisa={modoPesquisa}
        aoTogglePesquisa={() => { setModoPesquisa(v => !v); setTermoPesquisa('') }} //limpa a pesquisa quando fecha o mode de pequisa
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
        <>
          {/* Calendario */}
          <Calendar
            current={dataSelecionada}
            onDayPress={dia => setDataSelecionada(dia.dateString)}
            markedDates={construirDatasMarcadas(eventos, dataSelecionada)}
            theme={temaAgenda}
          />

          {/* Lista de eventos da data selecionada */}
          <FlatList
            data={eventosDoDia}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listaEventos}
            ListEmptyComponent={
              <View style={styles.semEventos}>
                <Text style={styles.textoSemEventos}>📅</Text>
                <Text style={styles.textoSemEventos}>Sem eventos neste dia</Text>
                <Text style={styles.textoSemEventosDica}>Toque no + para adicionar</Text>
              </View>
            }
            renderItem={({ item }) => ( // 
              <ItemEvento item={item} aoPress={() => abrirEdicao(item)} />
            )}
          />
        </>
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