// Este arquivo reune valores e funções que vai ser usado em várias telas do app, pra não precisar repetir a mesma lógica/cores em cada arquivo


// Define as cores e rótulos de cada nível de prioridade
// Usado em toda a app para manter consistência visual
export const PRIORIDADE = {
  urgente:    { cor: '#ef4444', rotulo: '🔴 Urgente' },
  importante: { cor: '#f59e0b', rotulo: '🟡 Importante' },
  normal:     { cor: '#6b7280', rotulo: '⚪ Normal' },
}

// Cores/estilizacao do app

export const temaAgenda = {
  backgroundColor: '#0d0f12',
  calendarBackground: '#141618',
  textSectionTitleColor: '#6b7280',
  selectedDayBackgroundColor: '#4f46e5',
  selectedDayTextColor: '#fff',
  todayTextColor: '#4f46e5',
  dayTextColor: '#c9d1d9',
  textDisabledColor: '#3a3f4b',
  dotColor: '#4f46e5',
  monthTextColor: '#e8e8e8',
  arrowColor: '#4f46e5',
  agendaDayTextColor: '#c9d1d9',
  agendaDayNumColor: '#4f46e5',
  agendaTodayColor: '#4f46e5',
  agendaKnobColor: '#2a2d35',
}

// Retorna a data de hoje no formato YYYY-MM-DD (ex: "2026-06-13")
// Usado para comparar datas e marcar o dia atual
export function dataDeHoje() {
  return new Date().toISOString().split('T')[0]
}

// Verifica se um evento acontece nas próximas 24 horas

// data vem como "2026-06-13" e hora como "14:30" — fazemos o split('-')
// e split(':') pra separar em números, e então montamos um new Date()
// passando ano/mês/dia/hora/minuto separados. Isso é importante porque
// new Date("2026-06-13") sozinho cria a data em UTC, o que pode jogar
// pra um dia diferente dependendo do fuso horário do usuário
export function estaEmMenos24h(data, hora) {
  if (!data || !hora) return false
  const [ano, mes, dia] = data.split('-').map(Number)
  const [h, m] = hora.split(':').map(Number)
  // mes - 1 porque no JavaScript os meses começam em 0 (janeiro = 0)
  const evento = new Date(ano, mes - 1, dia, h || 0, m || 0)
  const diff = evento - Date.now()
  // diff > 0 = evento ainda não aconteceu
  // diff < 24h em milissegundos = está chegando
  return diff > 0 && diff < 24 * 60 * 60 * 1000
}

// Monta o objeto de marcações do calendário
// O componente Agenda espera um objeto no formato:
//   { "2026-06-13": { marked: true, dotColor: '#...', selected: true, ... } }
// Cada data com evento recebe um ponto colorido de acordo com a prioridade mais alta
export function construirDatasMarcadas(eventos, dataSelecionada) {
  const marcacoes = {}

  Object.keys(eventos).forEach(data => {
    const evs = eventos[data] || []
    const temUrgente = evs.some(e => e.prioridade === 'urgente')
    const temImportante = evs.some(e => e.prioridade === 'importante')
    
    const corPonto = temUrgente ? '#ef4444' : temImportante ? '#f59e0b' : '#6b7280'

    marcacoes[data] = {
      marked: true,
      dotColor: corPonto,
      selected: data === dataSelecionada,
      selectedColor: '#4f46e5',
    }
  })

  // Garante que o dia selecionado aparece marcado mesmo sem eventos
  if (!marcacoes[dataSelecionada]) {
    marcacoes[dataSelecionada] = { selected: true, selectedColor: '#4f46e5' }
  }

  return marcacoes
}

// Retorna todos os eventos urgentes/importantes que merecem alerta:
// - Eventos de hoje (independente da hora)
// - Eventos de outros dias que acontecem em menos de 24h
//
// Object.entries transforma { "2026-06-13": [...] } em pares [data, lista],
// o que facilita percorrer tanto a data quanto os eventos daquele dia.
// O ";(evs || [])" no início da linha é só pra evitar um erro de sintaxe
// (o JS pode confundir a linha anterior com uma chamada de função)
export function buscarAlertas(eventos) {
  const alertas = []
  const hoje = dataDeHoje()

  Object.entries(eventos).forEach(([data, evs]) => {
    ;(evs || []).forEach(ev => {
      const eUrgente = ev.prioridade === 'urgente' || ev.prioridade === 'importante'
      if (!eUrgente) return

      const ehHoje = data === hoje
      const dentro24h = estaEmMenos24h(data, ev.hora)

      if (ehHoje || dentro24h) {
        alertas.push({ ...ev, data })
      }
    })
  })

  return alertas
}

// Filtra eventos que batem com o termo de busca
// Procura na data, no título e na descrição do evento
export function pesquisarEventos(eventos, termo) {
  if (!termo.trim()) return []

  const q = termo.toLowerCase().trim()
  const resultados = []

  Object.entries(eventos).forEach(([data, evs]) => {
    ;(evs || []).forEach(ev => {
      const bateu = data.includes(q)
        || ev.titulo?.toLowerCase().includes(q)
        || ev.descricao?.toLowerCase().includes(q)

      if (bateu) resultados.push({ ...ev, data })
    })
  })

  // Ordena do evento mais próximo para o mais distante
  return resultados.sort((a, b) => a.data.localeCompare(b.data))
}