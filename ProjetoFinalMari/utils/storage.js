import * as FileSystem from 'expo-file-system/legacy';

const CAMINHO_EVENTOS   = FileSystem.documentDirectory + 'eventos_agenda.json';
const CAMINHO_USUARIO   = FileSystem.documentDirectory + 'usuario_agenda.json';

// ─── Helpers internos ─────────────────────────────────────────────────────────
async function lerArquivo(caminho) {
  try {
    const info = await FileSystem.getInfoAsync(caminho);
    if (!info.exists) return null;
    const json = await FileSystem.readAsStringAsync(caminho);
    return JSON.parse(json);
  } catch (e) {
    console.error('Erro ao ler arquivo:', e);
    return null;
  }
}

async function escreverArquivo(caminho, dados) {
  try {
    await FileSystem.writeAsStringAsync(caminho, JSON.stringify(dados));
  } catch (e) {
    console.error('Erro ao salvar arquivo:', e);
  }
}

// ─── Usuário ──────────────────────────────────────────────────────────────────
export async function buscarUsuario() {
  return await lerArquivo(CAMINHO_USUARIO);
}

export async function cadastrarUsuario(nomeUsuario, senha) {
  const usuario = { nomeUsuario, senha };
  await escreverArquivo(CAMINHO_USUARIO, usuario);
  return usuario;
}

export async function validarLogin(nomeUsuario, senha) {
  const usuario = await lerArquivo(CAMINHO_USUARIO);
  if (!usuario) return { sucesso: false, motivo: 'sem_cadastro' };
  if (usuario.nomeUsuario !== nomeUsuario || usuario.senha !== senha) {
    return { sucesso: false, motivo: 'credenciais_invalidas' };
  }
  return { sucesso: true };
}

// ─── Eventos ──────────────────────────────────────────────────────────────────
export async function loadEvents() {
  return (await lerArquivo(CAMINHO_EVENTOS)) || {};
}

export async function saveEvents(eventos) {
  await escreverArquivo(CAMINHO_EVENTOS, eventos);
}

export async function addEvent(data, evento) {
  const eventos = await loadEvents();
  if (!eventos[data]) eventos[data] = [];
  eventos[data].push(evento);
  await escreverArquivo(CAMINHO_EVENTOS, eventos);
  return eventos;
}

export async function updateEvent(data, idEvento, eventoAtualizado) {
  const eventos = await loadEvents();
  if (!eventos[data]) return eventos;
  eventos[data] = eventos[data].map(e => e.id === idEvento ? { ...e, ...eventoAtualizado } : e);
  await escreverArquivo(CAMINHO_EVENTOS, eventos);
  return eventos;
}

export async function deleteEvent(data, idEvento) {
  const eventos = await loadEvents();
  if (!eventos[data]) return eventos;
  eventos[data] = eventos[data].filter(e => e.id !== idEvento);
  if (eventos[data].length === 0) delete eventos[data];
  await escreverArquivo(CAMINHO_EVENTOS, eventos);
  return eventos;
}
