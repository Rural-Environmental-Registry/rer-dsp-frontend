import { buildHierarchyFieldsByKey } from '@/config/searchHierarchy'
import { FALLBACK_INSTALLATION_CONFIG } from '@/config/installationConfigFallback'
import type {
  HomeDetailSearchConfig,
  InstallationConfig,
} from '@/types/installationConfig'
import type { DetailByIdentifierDTO } from '@/types/totalizer'

export type DetailFieldKey =
  | 'id'
  | 'registrationDate'
  | 'alterationDate'
  | 'level3Name'
  | 'level2Name'
  | 'latitude'
  | 'longitude'
  | 'area'

export interface DetailFieldConfig {
  key: DetailFieldKey
  label: string
  group: 'header' | 'property'
  row?: number
  unitSuffix?: string
  formatAsMeasure?: boolean
  formatAsDate?: boolean
}

export interface DetailByIdentifierConfig {
  sectionTitle: string
  areaOfInterestSectionTitle: string
  emptyValue: string
  fields: DetailFieldConfig[]
  featuresDownload: {
    label: string
    enabled: boolean
  }
}

const DEFAULT_DETAIL_LABELS: HomeDetailSearchConfig = {
  sectionTitle: 'Search details',
  areaOfInterestSectionTitle: 'Area of interest data',
  registrationDateLabel: 'Registration date',
  alterationDateLabel: 'Alteration date',
  latitudeLabel: 'Latitude',
  longitudeLabel: 'Longitude',
  areaLabel: 'Area',
  featuresDownloadLabel: 'Download features',
}

export function buildDetailByIdentifierConfig(
  installation: InstallationConfig = FALLBACK_INSTALLATION_CONFIG,
): DetailByIdentifierConfig {
  const unitSuffix = installation.areaOfInterest.areaUnitLabel
  const hierarchy = buildHierarchyFieldsByKey(installation)
  const identifierLabel =
    installation.screens.home.identifier?.label ?? 'Identifier'
  const detail = installation.screens.home.detail ?? DEFAULT_DETAIL_LABELS

  return {
    sectionTitle: detail.sectionTitle,
    propertySectionTitle: detail.propertySectionTitle,
    emptyValue: '—',
    fields: [
      {
        key: 'id',
        label: identifierLabel,
        group: 'header',
      },
      {
        key: 'registrationDate',
        label: detail.registrationDateLabel,
        group: 'header',
        formatAsDate: true,
      },
      {
        key: 'alterationDate',
        label: detail.alterationDateLabel,
        group: 'header',
        formatAsDate: true,
      },
      {
        key: 'level3Name',
        label: hierarchy.level3.label,
        group: 'property',
        row: 1,
      },
      {
        key: 'level2Name',
        label: hierarchy.level2.label,
        group: 'property',
        row: 1,
      },
      {
        key: 'latitude',
        label: detail.latitudeLabel,
        group: 'property',
        row: 2,
      },
      {
        key: 'longitude',
        label: detail.longitudeLabel,
        group: 'property',
        row: 2,
      },
      {
        key: 'area',
        label: detail.areaLabel,
        group: 'property',
        row: 3,
        unitSuffix,
        formatAsMeasure: true,
      },
    ],
    featuresDownload: {
      label: detail.featuresDownloadLabel,
      enabled: false,
    },
  }
}

export const detailByIdentifierConfig: DetailByIdentifierConfig =
  buildDetailByIdentifierConfig()

export function getDetailFieldsByGroup(
  group: DetailFieldConfig['group'],
  config: DetailByIdentifierConfig = detailByIdentifierConfig,
): DetailFieldConfig[] {
  return config.fields.filter((field) => field.group === group)
}

export function getPropertyFieldRows(
  config: DetailByIdentifierConfig = detailByIdentifierConfig,
): DetailFieldConfig[][] {
  const propertyFields = getDetailFieldsByGroup('property', config)
  const byRow = new Map<number, DetailFieldConfig[]>()

  for (const field of propertyFields) {
    const row = field.row ?? 1
    const list = byRow.get(row) ?? []
    list.push(field)
    byRow.set(row, list)
  }

  return [...byRow.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, fields]) => fields)
}

export function readDetailFieldValue(
  detail: DetailByIdentifierDTO,
  key: DetailFieldKey,
): string | number | undefined | null {
  switch (key) {
    case 'id':
      return detail.id
    case 'registrationDate':
      return detail.registrationDate
    case 'alterationDate':
      return detail.alterationDate
    case 'latitude':
      return detail.latitude
    case 'longitude':
      return detail.longitude
    case 'area':
      return detail.area
    case 'level2Name':
      return detail.territory?.level2?.name
    case 'level3Name':
      return detail.territory?.level3?.name
    default:
      return undefined
  }
}
