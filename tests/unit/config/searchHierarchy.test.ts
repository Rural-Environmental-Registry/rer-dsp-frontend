import { describe, expect, it } from 'vitest'
import {
  buildHierarchyFieldsByKey,
  buildSearchFormConfig,
} from '@/config/searchHierarchy'
import { FALLBACK_INSTALLATION_CONFIG } from '@/config/installationConfigFallback'

describe('searchHierarchy helpers', () => {
  it('should keep home with 2 levels and downloads with 3', () => {
    const home = buildSearchFormConfig(FALLBACK_INSTALLATION_CONFIG, 'home')
    const downloads = buildSearchFormConfig(FALLBACK_INSTALLATION_CONFIG, 'downloads')

    expect(home.hierarchyKeys).toEqual(['level2', 'level3'])
    expect(downloads.hierarchyKeys).toEqual(['level1', 'level2', 'level3'])
  })

  it('should map hierarchy labels from installation config', () => {
    const custom = {
      ...FALLBACK_INSTALLATION_CONFIG,
      hierarchy: [
        { key: 'level1' as const, label: 'Country', placeholder: 'Select country', order: 1 },
        { key: 'level2' as const, label: 'Region', placeholder: 'Select region', order: 2 },
        { key: 'level3' as const, label: 'District', placeholder: 'Select district', order: 3 },
      ],
    }

    const fields = buildHierarchyFieldsByKey(custom)

    expect(fields.level1.label).toBe('Country')
    expect(fields.level2.label).toBe('Region')
    expect(fields.level3.label).toBe('District')
  })
})
