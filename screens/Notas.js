//imports

import { useState, useCallback, useRef } from 'react'
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor'
import { loadNotas, addNota, updateNota, deleteNota } from '../utils/storage'
import styles from '../styles/notasStyles'

// Tela de edição/criação de uma nota

function NotaEditor({ nota, onSalvar, onExcluir, onFechar }) {
  // O RichEditor nao usa estado do React pro conteudo ele guarda no HTML internamente. Ai tem que usar uma ref pra "pedir" o conteudo so na hora de salvar
  const editorRef = useRef(null)
  const [titulo, setTitulo] = useState(nota?.titulo || '')
  const conteudoInicial = nota?.conteudo || ''  //mostra o contedo se tiver, se nao mostra vazio

  async function salvar() {
    // getContentHtml() pega o HTML atual de dentro do editor
    const conteudo = await editorRef.current?.getContentHtml() 
    if (!titulo.trim() && !conteudo?.trim()) return onFechar() // Se nao tiver nada ele volta sem salvar
    onSalvar({ titulo: titulo.trim() || 'Sem título', conteudo: conteudo || '' })
  }

  return (
    <SafeAreaView style={styles.fundo}>
      <View style={styles.editorHeader}>
        <TouchableOpacity onPress={onFechar}>
          <Text style={styles.textoBotaoHeader}>← Voltar</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 16 }}>
          {nota && (
            <TouchableOpacity onPress={onExcluir}>
              <Text style={styles.textoExcluirHeader}>Excluir</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={salvar}>
            <Text style={styles.textoBotaoHeader}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>

      
      <View style={styles.containerTitulo}>
        <TextInput
          style={styles.campoTitulo}
          placeholder="Título da nota"
          placeholderTextColor="#555"
          value={titulo}
          onChangeText={setTitulo}
        />
      </View>

      
      <RichToolbar
        editor={editorRef}
        style={styles.barraFormatacao}
        iconTint="#888"
        selectedIconTint="#4f46e5"
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading1,
          actions.heading2,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.undo,
          actions.redo,
        ]}
        // Os icone do H1 e do h2 nao vem por padrao ai tem que criar um componente pra mostrar eles
        iconMap={{
          [actions.heading1]: () => <Text style={styles.iconeToolbar}>H1</Text>,
          [actions.heading2]: () => <Text style={styles.iconeToolbar}>H2</Text>,
        }}
      />

      <ScrollView style={{ flex: 1 }}>
        <RichEditor
          ref={editorRef}
          style={styles.editor}
          placeholder="Escreva aqui..."
          initialContentHTML={conteudoInicial}
          androidLayerType="hardware" //permite usar acentos no android
          editorStyle={{
            backgroundColor: '#0d0f12',
            color: '#c9d1d9',
            placeholderColor: '#555',
            caretColor: '#4f46e5',
            contentCSSText: 'font-size: 16px; font-family: sans-serif; padding: 16px;',
          }}
          onChange={text => {
            // Se  nao bota titulo ele pega os primeiros 40 digito pra mostrar no card da lista de notas
            if (!titulo && text.length > 0) {
              const semHtml = text.replace(/<[^>]+>/g, '').trim().slice(0, 40)
              setTitulo(semHtml)
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}


export default function Notas() {
  //variaveis
  const [notas, setNotas] = useState([])
  const [notaAberta, setNotaAberta] = useState(null)  // nota sendo editada (ou null)
  const [criandoNova, setCriandoNova] = useState(false)

  useFocusEffect(useCallback(() => {
    loadNotas().then(setNotas) //quando a tela ta visivel ele carrega as nota 
  }, []))

  async function salvarNota(dados) {
    let novas
    if (notaAberta) {
      novas = await updateNota(notaAberta.id, dados) //se tiver nota aberta ele atualiza ela
    } else {
      novas = await addNota({
        id: Date.now().toString(), 
        ...dados,
        criadoEm: new Date().toISOString(),// mostra a data de criracao da nota
      })
    }
    setNotas(novas)
    setNotaAberta(null)
    setCriandoNova(false)
  }

  function excluirNota() {
    Alert.alert('Excluir nota', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        const novas = await deleteNota(notaAberta.id)
        setNotas(novas)
        setNotaAberta(null)
      }},
    ])
  }

  // Tira as tags HTML pra mostrar prévia no card
  function previa(html) {
    return html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || ''
  }


  if (notaAberta || criandoNova) {
    return (
      <NotaEditor
        nota={notaAberta}
        onSalvar={salvarNota}
        onExcluir={excluirNota}
        onFechar={() => { setNotaAberta(null); setCriandoNova(false) }}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloTela}>📝 Anotações</Text>
        <Text style={styles.subtituloTela}>Suas notas pessoais</Text>
      </View>

      <FlatList
        data={notas}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.textoVazio}>📭</Text>
            <Text style={styles.textoVazio}>Nenhuma anotação ainda</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setNotaAberta(item)}>
            <Text style={styles.cardTitulo}>{item.titulo}</Text>
            <Text style={styles.cardTexto} numberOfLines={3}>{previa(item.conteudo)}</Text>
            <Text style={styles.cardData}>
              {new Date(item.criadoEm).toLocaleDateString('pt-BR')}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setCriandoNova(true)}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}