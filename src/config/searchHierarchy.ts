/**
 * Configuração da busca.
 * Rótulos/níveis visíveis por tela — genéricos (DPG). Depois o backend pode sobrescrever.
 *
 * Mapeamento interno atual (= Consulta Pública, só no código):
 * - level1 = região (só Downloads)
 * - level2 = UF / estado
 * - level3 = município
 * - identifier = identificador do registro
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
  level1: { key: 'level1', label: 'Nível 1', placeholder: 'Selecione o nível 1' },
  level2: { key: 'level2', label: 'Nível 2', placeholder: 'Selecione o nível 2' },
  level3: { key: 'level3', label: 'Nível 3', placeholder: 'Selecione o nível 3' },
}

export const homeSearchConfig: SearchFormConfig = {
  title: 'Consulte os dados cadastrados',
  hierarchyKeys: ['level2', 'level3'],
  identifier: {
    key: 'identifier',
    label: 'Identificador',
    placeholder: 'Informe o identificador',
  },
}

export const downloadsSearchConfig: SearchFormConfig = {
  title: 'Downloads',
  hierarchyKeys: ['level1', 'level2', 'level3'],
}

export function resolveHierarchyFields(keys: HierarchyLevelKey[]): HierarchyFieldConfig[] {
  return keys.map((key) => hierarchyFieldsByKey[key])
}
