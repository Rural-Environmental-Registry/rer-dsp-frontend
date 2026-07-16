/**
 * Textos e campos do quadro de detalhes por identificador.
 * Hoje: arquivo local. Depois: pode vir do backend (mesmo shape).
 *
 * Rótulos de localização/identificador reutilizam searchHierarchy
 * para ficar iguais aos filtros da home (Nível 2, Nível 3, Identificador).
 */

import { hierarchyFieldsByKey, homeSearchConfig } from '@/config/searchHierarchy'

export type DetailFieldKey =
  | 'codeProperty'
  | 'createdAt'
  | 'nameCity'
  | 'nameState'
  | 'latitude'
  | 'longitude'
  | 'haRegisteredArea'

export interface DetailFieldConfig {
  key: DetailFieldKey
  label: string
  /** header = topo; property = bloco "dados do registro" */
  group: 'header' | 'property'
  /**
   * Linha visual no bloco property (como no CP: localização, coords, área).
   * Só se aplica a group === 'property'.
   */
  row?: number
  /** Sufixo exibido após o valor (ex.: ha). */
  unitSuffix?: string
  /** Formata como medida (2 casas pt-BR). */
  formatAsMeasure?: boolean
}

export interface DetailByIdentifierConfig {
  sectionTitle: string
  propertySectionTitle: string
  emptyValue: string
  fields: DetailFieldConfig[]
  featuresDownload: {
    label: string
    /** Por enquanto sempre desabilitado (GeoServer ainda sem definição). */
    enabled: boolean
  }
}

export const detailByIdentifierConfig: DetailByIdentifierConfig = {
  sectionTitle: 'Detalhes da pesquisa',
  propertySectionTitle: 'Dados do registro',
  emptyValue: '—',
  fields: [
    {
      key: 'codeProperty',
      label: homeSearchConfig.identifier?.label ?? 'Identificador',
      group: 'header',
    },
    { key: 'createdAt', label: 'Data de cadastro', group: 'header' },
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
      label: 'Área',
      group: 'property',
      row: 3,
      unitSuffix: 'ha',
      formatAsMeasure: true,
    },
  ],
  featuresDownload: {
    label: 'Baixar feições',
    enabled: false,
  },
}

export function getDetailFieldsByGroup(
  group: DetailFieldConfig['group'],
  config: DetailByIdentifierConfig = detailByIdentifierConfig,
): DetailFieldConfig[] {
  return config.fields.filter((field) => field.group === group)
}

/** Agrupa campos property por `row` (ordem crescente). */
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
