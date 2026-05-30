import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  titulo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitulo: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
  },
  campo: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  botao: {
    width: '100%',
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rodape: {
    color: '#aaa',
    marginTop: 20,
  },
  fundoCarregando: {
    flex: 1,
    backgroundColor: '#0d0f12',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default styles
