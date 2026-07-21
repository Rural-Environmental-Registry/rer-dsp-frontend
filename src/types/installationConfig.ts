import type { HierarchyLevelKey } from '@/types/hierarchy'

export interface HierarchyLevelConfig {
  key: HierarchyLevelKey
  label: string
  placeholder: string
  order: number
}

export interface ScreenFieldConfig {
  key: string
  label: string
  placeholder: string
}

export interface ScreenConfig {
  title: string
  hierarchyKeys: HierarchyLevelKey[]
  identifier?: ScreenFieldConfig | null
  theme?: ScreenFieldConfig | null
  level1SectionTitle?: string | null
  level2SectionTitle?: string | null
  filterByTitle?: string | null
}

export interface ScreensConfig {
  home: ScreenConfig
  downloads: ScreenConfig
}

export interface KpiCardConfig {
  code: string
  label: string
  unitOfMeasurement?: string | null
  optionalLabel?: string | null
  accentColor: string
  order: number
  required?: boolean
}

export interface HomeKpisConfig {
  maxCards: number
  /** Código do card principal obrigatório (ex.: REGISTERED_AREA / imóveis cadastrados). */
  primaryCode: string
  cards: KpiCardConfig[]
}

export interface InstallationConfig {
  hierarchy: HierarchyLevelConfig[]
  screens: ScreensConfig
  kpis: HomeKpisConfig
}

export type InstallationScreenId = keyof ScreensConfig
