import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0f12' },

  header: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#141618',
    borderBottomWidth: 1,
    borderBottomColor: '#1e2127',
  },
  tituloTela: { fontSize: 20, fontWeight: 'bold', color: '#e8e8e8' },
  subtituloTela: { fontSize: 12, color: '#555', marginTop: 2 },

  lista: { padding: 16, paddingBottom: 100 },

  vazio: { alignItems: 'center', marginTop: 80, gap: 8 },
  textoVazio: { color: '#555', fontSize: 16 },

  card: {
    backgroundColor: '#141618',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  cardTitulo: { color: '#e8e8e8', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  cardTexto: { color: '#888', fontSize: 13 },
  cardData: { color: '#555', fontSize: 11, marginTop: 8 },

  fab: {
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
  },
  fabTexto: { color: '#fff', fontSize: 32, fontWeight: 'bold', lineHeight: 36 },

  // Editor
  fundo: { flex: 1, backgroundColor: '#0d0f12' },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#141618',
    borderBottomWidth: 1,
    borderBottomColor: '#1e2127',
  },
  botaoHeader: { padding: 6 },
  textoBotaoHeader: { color: '#4f46e5', fontSize: 15, fontWeight: '600' },
  textoExcluirHeader: { color: '#ef4444', fontSize: 15, fontWeight: '600' },

  campoTitulo: {
    color: '#e8e8e8',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  campoTexto: {
    flex: 1,
    color: '#c9d1d9',
    fontSize: 16,
    padding: 16,
    paddingTop: 8,
    textAlignVertical: 'top',
  },

  barraFormatacao: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#141618',
    borderTopWidth: 1,
    borderTopColor: '#1e2127',
  },
  botaoFormato: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1e2127',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2d35',
  },
  botaoFormatoAtivo: {
    backgroundColor: '#2a2050',
    borderColor: '#4f46e5',
  },
  textoBotaoFormato: { color: '#c9d1d9', fontSize: 16, fontWeight: 'bold' },
})

export default styles
