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

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141618',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4f46e5',
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxMarcado: {
    backgroundColor: '#4f46e5',
  },
  checkboxTexto: { color: '#fff', fontWeight: 'bold' },

  nomeHabito: { color: '#e8e8e8', fontSize: 15, flex: 1 },
  nomeHabitoFeito: { color: '#555', textDecorationLine: 'line-through' },

  // Adicionar hábito
  novoContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#141618',
    borderTopWidth: 1,
    borderTopColor: '#1e2127',
  },
  campoNovo: {
    flex: 1,
    backgroundColor: '#1e2127',
    color: '#e8e8e8',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2a2d35',
  },
  botaoAdicionar: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  textoAdicionar: { color: '#fff', fontWeight: 'bold' },

  progresso: { color: '#888', fontSize: 12, marginTop: 4 },
})

export default styles
