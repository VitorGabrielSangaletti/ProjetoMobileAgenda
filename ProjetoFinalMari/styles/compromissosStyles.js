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
  tituloTela:  { fontSize: 20, fontWeight: 'bold', color: '#e8e8e8' },
  subtituloTela: { fontSize: 12, color: '#555', marginTop: 2 },

  lista: { padding: 16, paddingBottom: 40 },

  vazio: { alignItems: 'center', marginTop: 80, gap: 8 },
  textoVazio: { color: '#555', fontSize: 16 },

  card: {
    backgroundColor: '#141618',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    elevation: 2,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titulo:   { color: '#e8e8e8', fontSize: 15, fontWeight: 'bold', flex: 1, marginRight: 8 },
  countdown: { color: '#4f46e5', fontSize: 13, fontWeight: '700' },
  countdownUrgente: { color: '#ef4444' },

  linha:    { flexDirection: 'row', gap: 16, marginBottom: 4 },
  data:     { color: '#666', fontSize: 12 },
  hora:     { color: '#666', fontSize: 12 },
  descricao: { color: '#555', fontSize: 13, marginTop: 4 },
})

export default styles
