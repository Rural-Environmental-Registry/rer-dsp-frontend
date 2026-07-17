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

export const DEFAULT_KPI_COLORS = ['#CED6E5', '#C1D2F2', '#98B7EC', '#97CCE3', '#B6C3D9']

export const mockHomeKpis: KpiItem[] = [
  {
    id: 'kpi-1',
    title: 'Total records',
    value: 128450,
    unitOfMeasurement: 'un.',
    accentColor: DEFAULT_KPI_COLORS[0],
  },
  {
    id: 'kpi-2',
    title: 'Total area',
    value: 2456789.5,
    unitOfMeasurement: 'ha',
    optionalLabel: 'areas',
    optionalValue: 98210,
    accentColor: DEFAULT_KPI_COLORS[1],
  },
  {
    id: 'kpi-3',
    title: 'Published themes',
    value: 42,
    unitOfMeasurement: 'themes',
    accentColor: DEFAULT_KPI_COLORS[2],
  },
  {
    id: 'kpi-4',
    title: 'Official gazette publications',
    value: 6000,
    unitOfMeasurement: 'themes',
    accentColor: DEFAULT_KPI_COLORS[3],
  },
  {
    id: 'kpi-5',
    title: 'Open communications',
    value: 420,
    unitOfMeasurement: 'themes',
    accentColor: DEFAULT_KPI_COLORS[4],
  },
]

export function resolveHomeKpis(kpis: KpiItem[]): KpiItem[] {
  if (!kpis.length) {
    return []
  }

  return kpis.slice(0, MAX_HOME_KPIS)
}
