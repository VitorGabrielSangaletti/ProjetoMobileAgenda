import { doc, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore'
import { db, auth } from './firebase'

// Pega o documento do usuário logado no Firestore
function docUsuario() {
  const uid = auth.currentUser?.uid // se nao tiver usuario no firebase o uid vai ser indefinido e vai gera um erro. 
  if (!uid) throw new Error('Usuário não autenticado') 
  return doc(db, 'usuarios', uid) 
}

// Carrega os eventos do usuario.
export async function loadEvents() {
  try {
    const snap = await getDoc(docUsuario())
    if (!snap.exists()) return {} // Se o documento nao existir, retorna um objeto vazio
    return snap.data().eventos || {}
  } catch (e) {
    console.error('Erro ao carregar eventos:', e)
    return {}
  }
}

async function salvarTodos(eventos) {
  await setDoc(docUsuario(), { eventos })
}

export async function addEvent(data, evento) { 
  const eventos = await loadEvents()
  if (!eventos[data]) eventos[data] = [] // Se na data nao tiver nenhum evento cria um array vazio pra adicionar o evento
  eventos[data].push(evento)
  await salvarTodos(eventos)
  return eventos
}

export async function updateEvent(data, idEvento, eventoAtualizado) {
  const eventos = await loadEvents()
  if (!eventos[data]) return eventos
  eventos[data] = eventos[data].map(e =>
    e.id === idEvento ? { ...e, ...eventoAtualizado } : e 
  )
  await salvarTodos(eventos)
  return eventos
}

export async function deleteEvent(data, idEvento) {
  const eventos = await loadEvents()
  if (!eventos[data]) return eventos
  eventos[data] = eventos[data].filter(e => e.id !== idEvento)
  if (eventos[data].length === 0) delete eventos[data] 
  await salvarTodos(eventos)
  return eventos
}
