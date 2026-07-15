/**
 * Configuração da busca.
 * Rótulos/níveis visíveis por tela. Depois o backend pode sobrescrever.
 *
 * Mapeamento atual = Consulta Pública:
 * - level1 = região (só Downloads)
 * - level2 = UF
 * - level3 = município
 * - identifier = nº CAR / identificador
 */

export type HierarchyLevelKey = 'level1' | 'level2' | 'level3'

export interface SelectOption {
  value: string
  label: string
}

export interface HierarchyFieldConfig {
  key: HierarchyLevelKey
  label: string
  placeholder: string
}

export interface IdentifierFieldConfig {
  key: string
  label: string
  placeholder: string
}

export interface SearchFormConfig {
  title: string
  hierarchyKeys: HierarchyLevelKey[]
  identifier?: IdentifierFieldConfig
}

export const hierarchyFieldsByKey: Record<HierarchyLevelKey, HierarchyFieldConfig> = {
  level1: { key: 'level1', label: 'Região', placeholder: 'Selecione a região' },
  level2: { key: 'level2', label: 'UF', placeholder: 'Selecione a UF' },
  level3: { key: 'level3', label: 'Município', placeholder: 'Selecione o município' },
}

export const homeSearchConfig: SearchFormConfig = {
  title: 'Consulte os dados cadastrados',
  hierarchyKeys: ['level2', 'level3'],
  identifier: {
    key: 'identifier',
    label: 'Nº do CAR',
    placeholder: 'Informe o número do CAR',
  },
}

export const downloadsSearchConfig: SearchFormConfig = {
  title: 'Downloads',
  hierarchyKeys: ['level1', 'level2', 'level3'],
}

export function resolveHierarchyFields(keys: HierarchyLevelKey[]): HierarchyFieldConfig[] {
  return keys.map((key) => hierarchyFieldsByKey[key])
}
