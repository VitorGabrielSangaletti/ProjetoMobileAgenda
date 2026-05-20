import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Agenda } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';

import { loadEvents, addEvent, updateEvent, deleteEvent } from '../utils/storage';
import { buscarAlertas, pesquisarEventos, construirDatasMarcadas, temaAgenda } from '../utils/constantes';

import BarraSuperior            from '../components/BarraSuperior';
import BannerAlerta             from '../components/BannerAlerta';
import ModalAlertas             from '../components/ModalAlertas';
import EventModal               from './EventModal';
import { ItemEvento, ResultadoPesquisa } from '../components/ItemEvento';

export default function Home({ navigation }) {
  const [eventos, setEventos]               = useState({});
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [modalVisivel, setModalVisivel]     = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [alertaVisivel, setAlertaVisivel]   = useState(false);
  const [termoPesquisa, setTermoPesquisa]   = useState('');
  const [modoPesquisa, setModoPesquisa]     = useState(false);

  useFocusEffect(useCallback(() => {
    (async () => {
      const armazenados = await loadEvents();
      setEventos(armazenados);
      if (buscarAlertas(armazenados).length > 0) setAlertaVisivel(true);
    })();
  }, []));

  useEffect(() => {
    if (buscarAlertas(eventos).length === 0) setAlertaVisivel(false);
  }, [eventos]);

  async function aoSalvar(dados) {
    const atualizado = eventoEditando
      ? await updateEvent(dataSelecionada, dados.id, dados)
      : await addEvent(dataSelecionada, dados);
    setEventos(atualizado);
    setModalVisivel(false);
    setEventoEditando(null);
  }

  async function aoExcluir(idEvento) {
    Alert.alert('Excluir evento', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        const atualizado = await deleteEvent(dataSelecionada, idEvento);
        setEventos(atualizado);
        setModalVisivel(false);
        setEventoEditando(null);
      }},
    ]);
  }

  function abrirEdicao(evento, data) {
    setDataSelecionada(data || dataSelecionada);
    setEventoEditando(evento);
    setModalVisivel(true);
  }

  const alertas  = buscarAlertas(eventos);
  const itensAgenda = Object.fromEntries(
    Object.entries(eventos).map(([data, evs]) => [data, evs.map(e => ({ ...e, height: 60 }))])
  );

  return (
    <SafeAreaView style={styles.container}>

      <BarraSuperior
        modoPesquisa={modoPesquisa}
        aoTogglePesquisa={() => { setModoPesquisa(v => !v); setTermoPesquisa(''); }}
        aoSair={() => navigation.replace('Login')}
        aoAbrirCompromissos={() => navigation.navigate('Compromissos')}
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => { setEventoEditando(null); setModalVisivel(true); }}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      <EventModal
        visible={modalVisivel}
        date={dataSelecionada}
        event={eventoEditando}
        onSave={aoSalvar}
        onDelete={aoExcluir}
        onClose={() => { setModalVisivel(false); setEventoEditando(null); }}
      />

      <ModalAlertas
        visivel={alertaVisivel}
        alertas={alertas}
        aoFechar={() => setAlertaVisivel(false)}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#0d0f12' },
  semEvento:     { height: 50, justifyContent: 'center', paddingLeft: 14 },
  textoSemEvento:{ color: '#333', fontSize: 13 },
  fab: {
    position: 'absolute', bottom: 30, right: 24,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#4f46e5',
    justifyContent: 'center', alignItems: 'center',
    elevation: 10, shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
  },
  fabTexto: { color: '#fff', fontSize: 32, fontWeight: 'bold', lineHeight: 36 },
});
