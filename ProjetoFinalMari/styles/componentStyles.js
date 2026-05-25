import { StyleSheet } from 'react-native'

export const barraSuperiorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#141618',
    borderBottomWidth: 1,
    borderBottomColor: '#1e2127',
  },
  nomeApp:    { fontSize: 20, fontWeight: 'bold', color: '#e8e8e8' },
  rotuloHoje: { fontSize: 12, color: '#555', marginTop: 2 },
  botoes:     { flexDirection: 'row', gap: 4 },
  botao:      { padding: 8 },
  icone:      { fontSize: 18, color: '#888' },
})

export const bannerAlertaStyles = StyleSheet.create({
  banner: {
    backgroundColor: '#3a1a1a',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    margin: 12,
    borderRadius: 8,
    padding: 12,
  },
  texto: { color: '#ef4444', fontWeight: '600', fontSize: 13 },
})

export const itemEventoStyles = StyleSheet.create({
  card:      { backgroundColor: '#141618', borderRadius: 12, padding: 16, marginRight: 10, marginTop: 14, borderLeftWidth: 4, elevation: 2 },
  linha:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo:    { color: '#e8e8e8', fontSize: 15, fontWeight: 'bold', flex: 1 },
  hora:      { color: '#888', fontSize: 12, marginLeft: 8 },
  descricao: { color: '#666', fontSize: 13, marginTop: 6 },

  campoPesquisa: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#141618', borderBottomWidth: 1, borderBottomColor: '#1e2127' },
  inputPesquisa: { backgroundColor: '#1e2127', color: '#e8e8e8', borderRadius: 10, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#2a2d35' },
  lista:         { flex: 1, backgroundColor: '#0d0f12', paddingHorizontal: 16, paddingTop: 8 },
  vazio:         { color: '#555', textAlign: 'center', marginTop: 40, fontSize: 14 },
  itemResultado: { backgroundColor: '#141618', borderRadius: 10, padding: 14, marginBottom: 10, borderLeftWidth: 3 },
  dataResultado: { fontSize: 11, color: '#555', marginBottom: 3 },
  tituloResultado: { fontSize: 15, fontWeight: 'bold', color: '#e8e8e8' },
  horaResultado:   { fontSize: 12, color: '#888', marginTop: 3 },
  descResultado:   { fontSize: 13, color: '#666', marginTop: 3 },
})

export const modalAlertasStyles = StyleSheet.create({
  fundo:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  caixa:       { backgroundColor: '#141618', borderRadius: 20, padding: 24, width: '100%', borderWidth: 1, borderColor: '#ef4444' },
  titulo:      { fontSize: 22, fontWeight: 'bold', color: '#e8e8e8', marginBottom: 4 },
  subtitulo:   { fontSize: 13, color: '#888', marginBottom: 16 },
  item:        { backgroundColor: '#1e2127', borderRadius: 10, padding: 14, marginBottom: 10, borderLeftWidth: 3 },
  itemTitulo:  { color: '#e8e8e8', fontWeight: 'bold', fontSize: 14 },
  itemMeta:    { color: '#888', fontSize: 12, marginTop: 3 },
  botaoFechar: { backgroundColor: '#1e2127', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16, borderWidth: 1, borderColor: '#2a2d35' },
  textoFechar: { color: '#888', fontWeight: '600' },
})
