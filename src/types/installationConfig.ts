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

export interface HomeDetailSearchConfig {
  sectionTitle: string
  propertySectionTitle: string
  registrationDateLabel: string
  alterationDateLabel: string
  latitudeLabel: string
  longitudeLabel: string
  areaLabel: string
  featuresDownloadLabel: string
}

export interface ScreenConfig {
  title: string
  hierarchyKeys: HierarchyLevelKey[]
  identifier?: ScreenFieldConfig | null
  theme?: ScreenFieldConfig | null
  level1SectionTitle?: string | null
  level2SectionTitle?: string | null
  filterByTitle?: string | null
  detail?: HomeDetailSearchConfig | null
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
  /** Required primary card code (e.g. AREA_OF_INTEREST / registered properties). */
  primaryCode: string
  cards: KpiCardConfig[]
}

export interface AreaOfInterestMeasuresConfig {
  areaUnit: string
  areaUnitLabel: string
}

export interface FormatsConfig {
  /** yyyy-MM-dd */
  date: string
  /** yyyy-MM-dd'T'HH:mm:ss */
  dateTime: string
}

export interface InstallationConfig {
  hierarchy: HierarchyLevelConfig[]
  screens: ScreensConfig
  kpis: HomeKpisConfig
  areaOfInterest: AreaOfInterestMeasuresConfig
  formats: FormatsConfig
}

export type InstallationScreenId = keyof ScreensConfig
