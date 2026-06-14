// Este arquivo centraliza toda a comunicação com o Firestore.
// Cada usuário logado tem um documento só, em "usuarios/{uid}", e dentro
// dele ficam os campos "eventos", "notas", "habitos" e "habitosFeitos".
//
// Padrão usado em quase todas as funções abaixo:
//   1. Carrega a lista/objeto inteiro do campo (load...)
//   2. Faz a alteração em memória (push, filter, map...)
//   3. Salva a lista/objeto inteiro de volta (salvarCampo)


// Funções do Firestore para ler e salvar documentos
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from './firebase'

// Retorna a referência do documento do usuário logado no Firestore
// Cada usuário tem seu próprio documento em: usuarios/{uid}
function docUsuario() {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Usuário não autenticado')
  return doc(db, 'usuarios', uid)
}

// Salva um campo específico (ex: 'eventos', 'notas') no documento do usuário
//
// updateDoc só funciona se o documento já existe — se você chamar
// updateDoc num documento que não existe, ele dá erro. Por isso checa
// primeiro com getDoc: se existir usamos updateDoc (atualiza só esse campo,
// sem afetar os outros), senão usamos setDoc (cria o documento do zero)
async function salvarCampo(campo, valor) {
  const ref = docUsuario()
  const snap = await getDoc(ref)

  if (snap.exists()) {
    await updateDoc(ref, { [campo]: valor })
  } else {
    await setDoc(ref, { [campo]: valor })
  }
}

// Lê um campo específico do documento do usuário
// Se o documento não existe OU o campo ainda não foi criado, retorna o valor padrão
async function carregarCampo(campo, padrao) {
  const snap = await getDoc(docUsuario())
  if (!snap.exists()) return padrao
  return snap.data()[campo] ?? padrao
}

// ─── Eventos ──────────────────────────────────────────────────────────────────

// Carrega todos os eventos do usuário (objeto indexado por data)
export async function loadEvents() {
  return carregarCampo('eventos', {})
}

// Adiciona um evento numa data específica e salva no Firestore
export async function addEvent(data, evento) {
  const eventos = await loadEvents()
  if (!eventos[data]) eventos[data] = []
  eventos[data].push(evento)
  await salvarCampo('eventos', eventos)
  return eventos
}

// Atualiza um evento existente pelo seu id
export async function updateEvent(data, idEvento, eventoAtualizado) {
  const eventos = await loadEvents()
  if (!eventos[data]) return eventos
  eventos[data] = eventos[data].map(e => e.id === idEvento ? { ...e, ...eventoAtualizado } : e)
  await salvarCampo('eventos', eventos)
  return eventos
}

// Remove um evento pelo id — se a data ficar vazia, remove a data também
export async function deleteEvent(data, idEvento) {
  const eventos = await loadEvents()
  if (!eventos[data]) return eventos
  eventos[data] = eventos[data].filter(e => e.id !== idEvento)
  if (eventos[data].length === 0) delete eventos[data]
  await salvarCampo('eventos', eventos)
  return eventos
}

// ─── Notas ────────────────────────────────────────────────────────────────────

// Carrega todas as notas do usuário (array)
export async function loadNotas() {
  return carregarCampo('notas', [])
}

// Adiciona uma nova nota ao array e salva
export async function addNota(nota) {
  const notas = await loadNotas()
  notas.push(nota)
  await salvarCampo('notas', notas)
  return notas
}

// Atualiza uma nota existente pelo id
export async function updateNota(id, dados) {
  const notas = await loadNotas()
  const novas = notas.map(n => n.id === id ? { ...n, ...dados } : n)
  await salvarCampo('notas', novas)
  return novas
}

// Remove uma nota pelo id
export async function deleteNota(id) {
  const notas = await loadNotas()
  const novas = notas.filter(n => n.id !== id)
  await salvarCampo('notas', novas)
  return novas
}

// ─── Hábitos ──────────────────────────────────────────────────────────────────

// Carrega a lista de hábitos cadastrados pelo usuário
export async function loadHabitos() {
  return carregarCampo('habitos', [])
}

// Adiciona um novo hábito à lista
export async function addHabito(habito) {
  const habitos = await loadHabitos()
  habitos.push(habito)
  await salvarCampo('habitos', habitos)
  return habitos
}

// Remove um hábito pelo id
export async function deleteHabito(id) {
  const habitos = await loadHabitos()
  const novos = habitos.filter(h => h.id !== id)
  await salvarCampo('habitos', novos)
  return novos
}

// Carrega o histórico de hábitos feitos por dia (objeto indexado por data)
export async function loadHabitosFeitos() {
  return carregarCampo('habitosFeitos', {})
}

// Marca ou desmarca um hábito como feito num dia específico
// Se já estava marcado, desmarca — se não estava, marca
export async function toggleHabitoFeito(data, idHabito) {
  const feitos = await loadHabitosFeitos()
  const doDia = feitos[data] || []

  feitos[data] = doDia.includes(idHabito)
    ? doDia.filter(id => id !== idHabito)  // desmarca
    : [...doDia, idHabito]                 // marca

  await salvarCampo('habitosFeitos', feitos)
  return feitos
}