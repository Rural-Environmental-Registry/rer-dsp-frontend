/**
 * KPIs da página principal — configuráveis de 1 a 5 itens.
 * Hoje mock; depois o backend devolve o array (tamanho 1..5).
 */

export const MIN_HOME_KPIS = 1
export const MAX_HOME_KPIS = 5

export interface KpiItem {
  id: string
  title: string
  value: number
  unitOfMeasurement?: string
  optionalLabel?: string
  optionalValue?: number
  accentColor: string
}

/** Tons pastel do Consulta Pública (topo dos cards de totalizador). */
export const DEFAULT_KPI_COLORS = ['#CED6E5', '#C1D2F2', '#98B7EC', '#97CCE3', '#B6C3D9']

/**
 * Mock com até 5 KPIs. Para testar 1–5, acrescente/remova itens neste array
 * (o util abaixo garante o limite).
 */
export const mockHomeKpis: KpiItem[] = [
  {
    id: 'kpi-1',
    title: 'Total de registros',
    value: 128450,
    unitOfMeasurement: 'un.',
    accentColor: DEFAULT_KPI_COLORS[0],
  },
  {
    id: 'kpi-2',
    title: 'Área total',
    value: 2456789.5,
    unitOfMeasurement: 'ha',
    optionalLabel: 'áreas',
    optionalValue: 98210,
    accentColor: DEFAULT_KPI_COLORS[1],
  },
  {
    id: 'kpi-3',
    title: 'Temas publicados',
    value: 42,
    unitOfMeasurement: 'temas',
    accentColor: DEFAULT_KPI_COLORS[2],
  },
  {
    id: 'kpi-4',
    title: 'Publicações no Diário Oficial',
    value: 6000,
    unitOfMeasurement: 'temas',
    accentColor: DEFAULT_KPI_COLORS[3],
  },
  {
    id: 'kpi-5',
    title: 'Comunicações em aberto',
    value: 420,
    unitOfMeasurement: 'temas',
    accentColor: DEFAULT_KPI_COLORS[4],
  },
]

/** Garante entre 1 e 5 KPIs para a UI. */
export function resolveHomeKpis(kpis: KpiItem[]): KpiItem[] {
  if (!kpis.length) {
    return []
  }

  return kpis.slice(0, MAX_HOME_KPIS)
}
