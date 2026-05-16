import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
  ScrollView, TextInput, Modal, FlatList, Alert,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { loadEvents, addEvent, updateEvent, deleteEvent } from '../utils/storage';
import EventModal from './EventModal';

// ─── Config de prioridades ────────────────────────────────────────────────────
const PRIORIDADE = {
  urgente:    { cor: '#ef4444', rotulo: '🔴 Urgente',    ponto: '#ef4444' },
  importante: { cor: '#f59e0b', rotulo: '🟡 Importante', ponto: '#f59e0b' },
  normal:     { cor: '#6b7280', rotulo: '⚪ Normal',      ponto: '#6b7280' },
};

// ─── Funções auxiliares ───────────────────────────────────────────────────────
function dataDeHoje() {
  return new Date().toISOString().split('T')[0];
}

function estaEmMenos24h(strData, strHora) {
  if (!strHora || !strData) return false;
  const [ano, mes, dia] = strData.split('-').map(Number);
  const [hora, minuto] = strHora.split(':').map(Number);
  // Constrói a data no horário local evitando problema de fuso UTC
  const dataEvento = new Date(ano, mes - 1, dia, hora || 0, minuto || 0, 0, 0);
  const diferenca = dataEvento - Date.now();
  return diferenca > 0 && diferenca < 24 * 60 * 60 * 1000;
}

function construirDatasMarcadas(eventos, dataSelecionada) {
  const marcacoes = {};
  Object.keys(eventos).forEach(data => {
    const eventosDoDia = eventos[data] || [];
    const temUrgente    = eventosDoDia.some(e => e.prioridade === 'urgente');
    const temImportante = eventosDoDia.some(e => e.prioridade === 'importante');
    const corPonto = temUrgente ? '#ef4444' : temImportante ? '#f59e0b' : '#6b7280';

    marcacoes[data] = {
      marked: true,
      dotColor: corPonto,
      selected: data === dataSelecionada,
      selectedColor: '#4f46e5',
    };
  });

  if (!marcacoes[dataSelecionada]) {
    marcacoes[dataSelecionada] = { selected: true, selectedColor: '#4f46e5' };
  }
  return marcacoes;
}

// ─── Busca alertas próximos ───────────────────────────────────────────────────
function buscarAlertas(eventos) {
  const alertas = [];
  Object.entries(eventos).forEach(([data, eventosDoDia]) => {
    (eventosDoDia || []).forEach(ev => {
      if ((ev.prioridade === 'urgente' || ev.prioridade === 'importante') && estaEmMenos24h(data, ev.hora)) {
        alertas.push({ ...ev, data });
      }
    });
  });
  return alertas;
}

// ─── Pesquisa de eventos ──────────────────────────────────────────────────────
function pesquisarEventos(eventos, termo) {
  if (!termo.trim()) return [];
  const termoBusca = termo.toLowerCase().trim();
  const resultados = [];

  Object.entries(eventos).forEach(([data, eventosDoDia]) => {
    const bateuData = data.includes(termoBusca);
    (eventosDoDia || []).forEach(ev => {
      const bateuTitulo = ev.titulo?.toLowerCase().includes(termoBusca);
      const bateuDescricao = ev.descricao?.toLowerCase().includes(termoBusca);
      if (bateuData || bateuTitulo || bateuDescricao) {
        resultados.push({ ...ev, data });
      }
    });
  });

  resultados.sort((a, b) => a.data.localeCompare(b.data));
  return resultados;
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Home({ navigation }) {
  const [eventos, setEventos]                   = useState({});
  const [dataSelecionada, setDataSelecionada]   = useState(dataDeHoje());
  const [modalVisivel, setModalVisivel]         = useState(false);
  const [eventoEditando, setEventoEditando]     = useState(null);
  const [alertaVisivel, setAlertaVisivel]       = useState(false);
  const [termoPesquisa, setTermoPesquisa]       = useState('');
  const [modoPesquisa, setModoPesquisa]         = useState(false);

  // Carrega os eventos ao entrar na tela
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const armazenados = await loadEvents();
        setEventos(armazenados);
        const alertas = buscarAlertas(armazenados);
        if (alertas.length > 0) setAlertaVisivel(true);
      })();
    }, [])
  );

  // Recalcula alertas toda vez que eventos mudam (cobre edição de prioridade)
  useEffect(() => {
    const alertasAtuais = buscarAlertas(eventos);
    if (alertasAtuais.length === 0) setAlertaVisivel(false);
  }, [eventos]);

  // ── Handlers do CRUD ─────────────────────────────────────────────
  async function aoSalvar(dados) {
    let atualizado;
    if (eventoEditando) {
      atualizado = await updateEvent(dataSelecionada, dados.id, dados);
    } else {
      atualizado = await addEvent(dataSelecionada, dados);
    }
    setEventos(atualizado);
    setModalVisivel(false);
    setEventoEditando(null);
  }

  async function aoExcluir(idEvento) {
    Alert.alert(
      'Excluir evento',
      'Tem certeza que deseja excluir este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const atualizado = await deleteEvent(dataSelecionada, idEvento);
            setEventos(atualizado);
            setModalVisivel(false);
            setEventoEditando(null);
          },
        },
      ]
    );
  }

  function abrirNovoEvento() {
    if (!dataSelecionada) return;
    setEventoEditando(null);
    setModalVisivel(true);
  }

  function abrirEdicaoEvento(evento, data) {
    setDataSelecionada(data || dataSelecionada);
    setEventoEditando(evento);
    setModalVisivel(true);
  }

  // ── Dados derivados ───────────────────────────────────────────────
  const datasMarcadas  = construirDatasMarcadas(eventos, dataSelecionada);
  const alertas        = buscarAlertas(eventos);
  const resultadosPesquisa = pesquisarEventos(eventos, termoPesquisa);

  // Formato esperado pelo componente Agenda
  const itensAgenda = Object.fromEntries(
    Object.entries(eventos).map(([data, evs]) => [
      data,
      evs.map(e => ({ ...e, height: 60 })),
    ])
  );

  // ── Render ────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>

      {/* ── Barra superior ── */}
      <View style={styles.barraSuperior}>
        <View>
          <Text style={styles.nomeApp}>📓 Agenda</Text>
          <Text style={styles.rotuloHoje}>{dataDeHoje()}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <TouchableOpacity
            style={styles.botaoPesquisa}
            onPress={() => {
              setModoPesquisa(v => !v);
              setTermoPesquisa('');
            }}
          >
            <Text style={styles.iconePesquisa}>{modoPesquisa ? '✕' : '🔍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoPesquisa}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.iconePesquisa}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Banner de alertas ── */}
      {alertas.length > 0 && (
        <TouchableOpacity style={styles.bannerAlerta} onPress={() => setAlertaVisivel(true)}>
          <Text style={styles.textoBannerAlerta}>
            🔔 {alertas.length} evento{alertas.length > 1 ? 's' : ''} urgente{alertas.length > 1 ? 's' : ''} nas próximas 24h
          </Text>
        </TouchableOpacity>
      )}

      {/* ── Campo de pesquisa ── */}
      {modoPesquisa && (
        <View style={styles.campoPesquisa}>
          <TextInput
            style={styles.inputPesquisa}
            placeholder="Buscar por data, título ou descrição..."
            placeholderTextColor="#555"
            value={termoPesquisa}
            onChangeText={setTermoPesquisa}
            autoFocus
          />
        </View>
      )}

      {/* ── Resultados da pesquisa ── */}
      {modoPesquisa && termoPesquisa.trim() !== '' ? (
        <FlatList
          style={styles.listaResultados}
          data={resultadosPesquisa}
          keyExtractor={item => item.id + item.data}
          ListEmptyComponent={
            <Text style={styles.semResultados}>Nenhum evento encontrado</Text>
          }
          renderItem={({ item }) => {
            const p = PRIORIDADE[item.prioridade] || PRIORIDADE.normal;
            return (
              <TouchableOpacity
                style={[styles.itemResultado, { borderLeftColor: p.cor }]}
                onPress={() => abrirEdicaoEvento(item, item.data)}
              >
                <Text style={styles.dataResultado}>{item.data}</Text>
                <Text style={styles.tituloResultado}>{item.titulo}</Text>
                {item.hora ? (
                  <Text style={styles.horaResultado}>⏰ {item.hora}</Text>
                ) : null}
                {item.descricao ? (
                  <Text style={styles.descricaoResultado} numberOfLines={1}>
                    {item.descricao}
                  </Text>
                ) : null}
                <Text style={{ color: p.cor, fontSize: 11, marginTop: 4 }}>
                  {p.rotulo}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        /* ── Calendário agenda ── */
        <Agenda
          items={itensAgenda}
          selected={dataSelecionada}
          markedDates={datasMarcadas}
          onDayPress={dia => setDataSelecionada(dia.dateString)}
          theme={temaAgenda}
          renderItem={(item) => {
            const p = PRIORIDADE[item.prioridade] || PRIORIDADE.normal;
            return (
              <TouchableOpacity
                style={[styles.itemEvento, { borderLeftColor: p.cor }]}
                onPress={() => abrirEdicaoEvento(item)}
              >
                <View style={styles.linhaItem}>
                  <Text style={styles.tituloItem}>{item.titulo}</Text>
                  {item.hora ? (
                    <Text style={styles.horaItem}>⏰ {item.hora}</Text>
                  ) : null}
                </View>
                {item.descricao ? (
                  <Text style={styles.descricaoItem} numberOfLines={2}>
                    {item.descricao}
                  </Text>
                ) : null}
                <Text style={{ color: p.cor, fontSize: 11, marginTop: 6 }}>
                  {p.rotulo}
                </Text>
              </TouchableOpacity>
            );
          }}
          renderEmptyDate={() => (
            <View style={styles.dataSemEvento}>
              <Text style={styles.textoSemEvento}>Sem eventos</Text>
            </View>
          )}
        />
      )}

      {/* ── Botão flutuante ── */}
      <TouchableOpacity style={styles.botaoFlutuante} onPress={abrirNovoEvento}>
        <Text style={styles.textoBotaoFlutuante}>+</Text>
      </TouchableOpacity>

      {/* ── Modal de evento (criar / editar / excluir) ── */}
      <EventModal
        visible={modalVisivel}
        date={dataSelecionada}
        event={eventoEditando}
        onSave={aoSalvar}
        onDelete={aoExcluir}
        onClose={() => {
          setModalVisivel(false);
          setEventoEditando(null);
        }}
      />

      {/* ── Popup de alertas ── */}
      <Modal visible={alertaVisivel} transparent animationType="fade">
        <View style={styles.fundoAlerta}>
          <View style={styles.caixaAlerta}>
            <Text style={styles.tituloAlerta}>🔔 Alertas</Text>
            <Text style={styles.subtituloAlerta}>
              Eventos nas próximas 24 horas:
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {alertas.map(ev => {
                const p = PRIORIDADE[ev.prioridade] || PRIORIDADE.normal;
                return (
                  <View key={ev.id + ev.data} style={[styles.itemAlerta, { borderLeftColor: p.cor }]}>
                    <Text style={styles.tituloItemAlerta}>{ev.titulo}</Text>
                    <Text style={styles.metaItemAlerta}>
                      {ev.data}{ev.hora ? ' às ' + ev.hora : ''}
                    </Text>
                    <Text style={{ color: p.cor, fontSize: 11 }}>{p.rotulo}</Text>
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.botaoFecharAlerta}
              onPress={() => setAlertaVisivel(false)}
            >
              <Text style={styles.textoFecharAlerta}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ─── Tema escuro da Agenda ────────────────────────────────────────────────────
const temaAgenda = {
  backgroundColor: '#0d0f12',
  calendarBackground: '#141618',
  textSectionTitleColor: '#6b7280',
  selectedDayBackgroundColor: '#4f46e5',
  selectedDayTextColor: '#fff',
  todayTextColor: '#4f46e5',
  dayTextColor: '#c9d1d9',
  textDisabledColor: '#3a3f4b',
  dotColor: '#4f46e5',
  monthTextColor: '#e8e8e8',
  arrowColor: '#4f46e5',
  agendaDayTextColor: '#c9d1d9',
  agendaDayNumColor: '#4f46e5',
  agendaTodayColor: '#4f46e5',
  agendaKnobColor: '#2a2d35',
};

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0f12',
  },

  // Barra superior
  barraSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#141618',
    borderBottomWidth: 1,
    borderBottomColor: '#1e2127',
  },
  nomeApp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e8e8e8',
  },
  rotuloHoje: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  botaoPesquisa: {
    padding: 8,
  },
  iconePesquisa: {
    fontSize: 18,
    color: '#888',
  },

  // Banner de alerta
  bannerAlerta: {
    backgroundColor: '#3a1a1a',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    margin: 12,
    borderRadius: 8,
    padding: 12,
  },
  textoBannerAlerta: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 13,
  },

  // Pesquisa
  campoPesquisa: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#141618',
    borderBottomWidth: 1,
    borderBottomColor: '#1e2127',
  },
  inputPesquisa: {
    backgroundColor: '#1e2127',
    color: '#e8e8e8',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2a2d35',
  },
  listaResultados: {
    flex: 1,
    backgroundColor: '#0d0f12',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  semResultados: {
    color: '#555',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
  itemResultado: {
    backgroundColor: '#141618',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  dataResultado: {
    fontSize: 11,
    color: '#555',
    marginBottom: 3,
  },
  tituloResultado: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e8e8e8',
  },
  horaResultado: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  descricaoResultado: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },

  // Itens da agenda
  itemEvento: {
    backgroundColor: '#141618',
    borderRadius: 12,
    padding: 16,
    marginRight: 10,
    marginTop: 14,
    borderLeftWidth: 4,
    elevation: 2,
  },
  linhaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tituloItem: {
    color: '#e8e8e8',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  horaItem: {
    color: '#888',
    fontSize: 12,
    marginLeft: 8,
  },
  descricaoItem: {
    color: '#666',
    fontSize: 13,
    marginTop: 6,
  },
  dataSemEvento: {
    height: 50,
    justifyContent: 'center',
    paddingLeft: 14,
  },
  textoSemEvento: {
    color: '#333',
    fontSize: 13,
  },

  // Botão flutuante
  botaoFlutuante: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  textoBotaoFlutuante: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
  },

  // Modal de alertas
  fundoAlerta: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  caixaAlerta: {
    backgroundColor: '#141618',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  tituloAlerta: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e8e8e8',
    marginBottom: 4,
  },
  subtituloAlerta: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
  },
  itemAlerta: {
    backgroundColor: '#1e2127',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  tituloItemAlerta: {
    color: '#e8e8e8',
    fontWeight: 'bold',
    fontSize: 14,
  },
  metaItemAlerta: {
    color: '#888',
    fontSize: 12,
    marginTop: 3,
  },
  botaoFecharAlerta: {
    backgroundColor: '#1e2127',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#2a2d35',
  },
  textoFecharAlerta: {
    color: '#888',
    fontWeight: '600',
  },
});
