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

export interface ThemeFieldConfig {
  key: string
  label: string
  placeholder: string
}

export interface SearchFormConfig {
  title: string
  hierarchyKeys: HierarchyLevelKey[]
  identifier?: IdentifierFieldConfig
  theme?: ThemeFieldConfig
}

export const hierarchyFieldsByKey: Record<HierarchyLevelKey, HierarchyFieldConfig> = {
  level1: { key: 'level1', label: 'Level 1', placeholder: 'Select level 1' },
  level2: { key: 'level2', label: 'Level 2', placeholder: 'Select level 2' },
  level3: { key: 'level3', label: 'Level 3', placeholder: 'Select level 3' },
}

export const homeSearchConfig: SearchFormConfig = {
  title: 'Browse registered data',
  hierarchyKeys: ['level2', 'level3'],
  identifier: {
    key: 'identifier',
    label: 'Identifier',
    placeholder: 'Enter the identifier',
  },
}

export const downloadsSearchConfig: SearchFormConfig = {
  title: 'Download public data',
  hierarchyKeys: ['level1', 'level2', 'level3'],
  theme: {
    key: 'theme',
    label: 'Theme',
    placeholder: 'All themes',
  },
}

export function resolveHierarchyFields(keys: HierarchyLevelKey[]): HierarchyFieldConfig[] {
  return keys.map((key) => hierarchyFieldsByKey[key])
}
