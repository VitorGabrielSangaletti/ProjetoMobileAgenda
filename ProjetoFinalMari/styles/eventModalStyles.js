import { StyleSheet } from 'react-native'

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
})

export default styles
