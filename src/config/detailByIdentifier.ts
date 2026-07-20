import { hierarchyFieldsByKey, homeSearchConfig } from '@/config/searchHierarchy'

export type DetailFieldKey =
  | 'codeProperty'
  | 'createdAt'
  | 'lastRectification'
  | 'nameCity'
  | 'nameState'
  | 'latitude'
  | 'longitude'
  | 'haRegisteredArea'

export interface DetailFieldConfig {
  key: DetailFieldKey
  label: string
  group: 'header' | 'property'
  row?: number
  unitSuffix?: string
  formatAsMeasure?: boolean
}

export interface DetailByIdentifierConfig {
  sectionTitle: string
  propertySectionTitle: string
  emptyValue: string
  fields: DetailFieldConfig[]
  featuresDownload: {
    label: string
    enabled: boolean
  }
}

export const detailByIdentifierConfig: DetailByIdentifierConfig = {
  sectionTitle: 'Search details',
  propertySectionTitle: 'Record data',
  emptyValue: '—',
  fields: [
    {
      key: 'codeProperty',
      label: homeSearchConfig.identifier?.label ?? 'Identifier',
      group: 'header',
    },
    { key: 'createdAt', label: 'Registration date', group: 'header' },
    { key: 'lastRectification', label: 'Alteration date', group: 'header' },
    {
      key: 'nameCity',
      label: hierarchyFieldsByKey.level3.label,
      group: 'property',
      row: 1,
    },
    {
      key: 'nameState',
      label: hierarchyFieldsByKey.level2.label,
      group: 'property',
      row: 1,
    },
    { key: 'latitude', label: 'Latitude', group: 'property', row: 2 },
    { key: 'longitude', label: 'Longitude', group: 'property', row: 2 },
    {
      key: 'haRegisteredArea',
      label: 'Area',
      group: 'property',
      row: 3,
      unitSuffix: 'ha',
      formatAsMeasure: true,
    },
  ],
  featuresDownload: {
    label: 'Download features',
    enabled: false,
  },
}

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
