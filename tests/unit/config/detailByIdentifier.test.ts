import { describe, expect, it } from 'vitest'
import {
  detailByIdentifierConfig,
  getDetailFieldsByGroup,
  getPropertyFieldRows,
} from '@/config/detailByIdentifier'
import { hierarchyFieldsByKey, homeSearchConfig } from '@/config/searchHierarchy'

describe('detailByIdentifier config', () => {
  it('should expose header and property field groups', () => {
    const header = getDetailFieldsByGroup('header')
    const property = getDetailFieldsByGroup('property')

    expect(header.map((field) => field.key)).toEqual(['codeProperty', 'createdAt'])
    expect(property.map((field) => field.key)).toEqual([
      'nameCity',
      'nameState',
      'latitude',
      'longitude',
      'haRegisteredArea',
    ])
  })

  it('should reuse search hierarchy labels for location and identifier', () => {
    const fields = detailByIdentifierConfig.fields
    const byKey = Object.fromEntries(fields.map((field) => [field.key, field.label]))

    expect(byKey.codeProperty).toBe(homeSearchConfig.identifier?.label)
    expect(byKey.nameCity).toBe(hierarchyFieldsByKey.level3.label)
    expect(byKey.nameState).toBe(hierarchyFieldsByKey.level2.label)
  })

  it('should group property fields in rows like CP layout', () => {
    const rows = getPropertyFieldRows()

    expect(rows.map((row) => row.map((field) => field.key))).toEqual([
      ['nameCity', 'nameState'],
      ['latitude', 'longitude'],
      ['haRegisteredArea'],
    ])
  })

  it('should not show centroid coordinates or fiscal modules', () => {
    const keys = detailByIdentifierConfig.fields.map((field) => field.key)
    expect(keys).not.toContain('geographicCoordinatesOfCentroid')
    expect(keys).not.toContain('fiscalModules')
  })

  it('should keep features download disabled for now', () => {
    expect(detailByIdentifierConfig.featuresDownload.enabled).toBe(false)
    expect(detailByIdentifierConfig.featuresDownload.label).toBeTruthy()
  })

  it('should not include lastRectification in visible fields', () => {
    const keys = detailByIdentifierConfig.fields.map((field) => field.key)
    expect(keys).not.toContain('lastRectification')
  })
})
