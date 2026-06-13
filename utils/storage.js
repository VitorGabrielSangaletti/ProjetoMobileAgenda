import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from './firebase'

function docUsuario() {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Usuário não autenticado')
  return doc(db, 'usuarios', uid)
}

async function salvarCampo(campo, valor) {
  const ref = docUsuario()
  const snap = await getDoc(ref)

  if (snap.exists()) {
    await updateDoc(ref, { [campo]: valor })
  } else {
    await setDoc(ref, { [campo]: valor })
  }
}

async function carregarCampo(campo, padrao) {
  const snap = await getDoc(docUsuario())
  if (!snap.exists()) return padrao
  return snap.data()[campo] ?? padrao
}

// Eventos
export async function loadEvents() {
  return carregarCampo('eventos', {})
}

export async function addEvent(data, evento) {
  const eventos = await loadEvents()
  if (!eventos[data]) eventos[data] = []
  eventos[data].push(evento)
  await salvarCampo('eventos', eventos)
  return eventos
}

export async function updateEvent(data, idEvento, eventoAtualizado) {
  const eventos = await loadEvents()
  if (!eventos[data]) return eventos
  eventos[data] = eventos[data].map(e => e.id === idEvento ? { ...e, ...eventoAtualizado } : e)
  await salvarCampo('eventos', eventos)
  return eventos
}

export async function deleteEvent(data, idEvento) {
  const eventos = await loadEvents()
  if (!eventos[data]) return eventos
  eventos[data] = eventos[data].filter(e => e.id !== idEvento)
  if (eventos[data].length === 0) delete eventos[data]
  await salvarCampo('eventos', eventos)
  return eventos
}

// Notas
export async function loadNotas() {
  return carregarCampo('notas', [])
}

export async function addNota(nota) {
  const notas = await loadNotas()
  notas.push(nota)
  await salvarCampo('notas', notas)
  return notas
}

export async function updateNota(id, dados) {
  const notas = await loadNotas()
  const novas = notas.map(n => n.id === id ? { ...n, ...dados } : n)
  await salvarCampo('notas', novas)
  return novas
}

export async function deleteNota(id) {
  const notas = await loadNotas()
  const novas = notas.filter(n => n.id !== id)
  await salvarCampo('notas', novas)
  return novas
}

// Hábitos
export async function loadHabitos() {
  return carregarCampo('habitos', [])
}

export async function addHabito(habito) {
  const habitos = await loadHabitos()
  habitos.push(habito)
  await salvarCampo('habitos', habitos)
  return habitos
}

export async function deleteHabito(id) {
  const habitos = await loadHabitos()
  const novos = habitos.filter(h => h.id !== id)
  await salvarCampo('habitos', novos)
  return novos
}

export async function loadHabitosFeitos() {
  return carregarCampo('habitosFeitos', {})
}

export async function toggleHabitoFeito(data, idHabito) {
  const feitos = await loadHabitosFeitos()
  const doDia = feitos[data] || []

  feitos[data] = doDia.includes(idHabito)
    ? doDia.filter(id => id !== idHabito)
    : [...doDia, idHabito]

  await salvarCampo('habitosFeitos', feitos)
  return feitos
}
