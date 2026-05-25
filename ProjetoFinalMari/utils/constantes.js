export const PRIORIDADE = {
  urgente:    { cor: '#ef4444', rotulo: '🔴 Urgente' },
  importante: { cor: '#f59e0b', rotulo: '🟡 Importante' },
  normal:     { cor: '#6b7280', rotulo: '⚪ Normal' },
}

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

export function dataDeHoje() {
  return new Date().toISOString().split('T')[0]
}

export function estaEmMenos24h(data, hora) {
  if (!data || !hora) return false
  const [ano, mes, dia] = data.split('-').map(Number)
  const [h, m] = hora.split(':').map(Number)
  const evento = new Date(ano, mes - 1, dia, h || 0, m || 0)
  const diff = evento - Date.now()
  return diff > 0 && diff < 24 * 60 * 60 * 1000
}

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

  if (!marcacoes[dataSelecionada]) {
    marcacoes[dataSelecionada] = { selected: true, selectedColor: '#4f46e5' }
  }

  return marcacoes
}

export function buscarAlertas(eventos) {
  const alertas = []

  Object.entries(eventos).forEach(([data, evs]) => {
    ;(evs || []).forEach(ev => {
      const eUrgente = ev.prioridade === 'urgente' || ev.prioridade === 'importante'
      if (eUrgente && estaEmMenos24h(data, ev.hora)) {
        alertas.push({ ...ev, data })
      }
    })
  })

  return alertas
}

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

  return resultados.sort((a, b) => a.data.localeCompare(b.data))
}
