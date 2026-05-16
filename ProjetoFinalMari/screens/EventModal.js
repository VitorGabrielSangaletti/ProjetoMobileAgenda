import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput,
  TouchableOpacity, StyleSheet, ScrollView, Platform
} from 'react-native';

const PRIORIDADES = [
  { rotulo: 'Normal',     valor: 'normal',     cor: '#6b7280', fundo: '#1e2127' },
  { rotulo: 'Importante', valor: 'importante', cor: '#f59e0b', fundo: '#2a2010' },
  { rotulo: 'Urgente',    valor: 'urgente',    cor: '#ef4444', fundo: '#2a1010' },
];

export default function EventModal({ visible, date, event, onSave, onDelete, onClose }) {
  const estaEditando = !!event;

  const [titulo, setTitulo]         = useState('');
  const [descricao, setDescricao]   = useState('');
  const [hora, setHora]             = useState('');
  const [prioridade, setPrioridade] = useState('normal');

  // Preenche os campos ao editar
  useEffect(() => {
    if (event) {
      setTitulo(event.titulo || '');
      setDescricao(event.descricao || '');
      setHora(event.hora || '');
      setPrioridade(event.prioridade || 'normal');
    } else {
      setTitulo('');
      setDescricao('');
      setHora('');
      setPrioridade('normal');
    }
  }, [event, visible]);

  function formatarHora(valor) {
    // Auto-formata como HH:MM enquanto digita
    const digitos = valor.replace(/\D/g, '').slice(0, 4);
    if (digitos.length <= 2) return digitos;
    return digitos.slice(0, 2) + ':' + digitos.slice(2);
  }

  function aoSalvar() {
    if (!titulo.trim()) return;

    const dados = {
      id: event?.id || Date.now().toString(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      hora: hora.trim(),
      prioridade,
      criadoEm: event?.criadoEm || new Date().toISOString(),
    };

    onSave(dados);
  }

  const prioridadeSelecionada = PRIORIDADES.find(p => p.valor === prioridade);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.fundo}>
        <View style={styles.painel}>
          {/* Cabeçalho */}
          <View style={styles.alca} />
          <Text style={styles.tituloPainel}>
            {estaEditando ? '✏️ Editar evento' : '📌 Novo evento'}
          </Text>
          <Text style={styles.dataPainel}>{date}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Título */}
            <Text style={styles.rotulo}>Título *</Text>
            <TextInput
              style={styles.campo}
              placeholder="Ex: Reunião com cliente"
              placeholderTextColor="#555"
              value={titulo}
              onChangeText={setTitulo}
            />

            {/* Hora */}
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

            {/* Descrição */}
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

            {/* Prioridade */}
            <Text style={styles.rotulo}>Prioridade</Text>
            <View style={styles.fileiraPrioridade}>
              {PRIORIDADES.map(p => (
                <TouchableOpacity
                  key={p.valor}
                  style={[
                    styles.botaoPrioridade,
                    { borderColor: p.cor },
                    prioridade === p.valor && { backgroundColor: p.fundo },
                  ]}
                  onPress={() => setPrioridade(p.valor)}
                >
                  <Text style={[styles.textoPrioridade, { color: p.cor }]}>
                    {p.rotulo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Ações */}
            <View style={styles.acoes}>
              <TouchableOpacity style={styles.botaoCancelar} onPress={onClose}>
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoSalvar, { backgroundColor: prioridadeSelecionada.cor }]}
                onPress={aoSalvar}
              >
                <Text style={styles.textoSalvar}>
                  {estaEditando ? 'Salvar' : 'Adicionar'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Excluir (só na edição) */}
            {estaEditando && (
              <TouchableOpacity style={styles.botaoExcluir} onPress={() => onDelete(event.id)}>
                <Text style={styles.textoExcluir}>🗑 Excluir evento</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  painel: {
    backgroundColor: '#141618',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  alca: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  tituloPainel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e8e8e8',
    marginBottom: 4,
  },
  dataPainel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
  },
  rotulo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  campo: {
    backgroundColor: '#1e2127',
    color: '#e8e8e8',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2a2d35',
  },
  campoPequeno: {
    width: 120,
  },
  campoMultilinha: {
    minHeight: 90,
  },
  fileiraPrioridade: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  botaoPrioridade: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  textoPrioridade: {
    fontWeight: '600',
    fontSize: 13,
  },
  acoes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  botaoCancelar: {
    flex: 1,
    backgroundColor: '#1e2127',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2d35',
  },
  textoCancelar: {
    color: '#888',
    fontWeight: '600',
  },
  botaoSalvar: {
    flex: 2,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoSalvar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  botaoExcluir: {
    alignItems: 'center',
    padding: 14,
  },
  textoExcluir: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
