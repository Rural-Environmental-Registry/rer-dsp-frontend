import { describe, expect, it } from 'vitest'
import {
  buildDetailByIdentifierConfig,
  detailByIdentifierConfig,
  getDetailFieldsByGroup,
  getPropertyFieldRows,
} from '@/config/detailByIdentifier'
import { FALLBACK_INSTALLATION_CONFIG } from '@/config/installationConfigFallback'
import type { InstallationConfig } from '@/types/installationConfig'

const ptbrInstallation: InstallationConfig = {
  ...FALLBACK_INSTALLATION_CONFIG,
  hierarchy: [
    { key: 'level1', label: 'Região', placeholder: 'Selecione uma região', order: 1 },
    { key: 'level2', label: 'Estado', placeholder: 'Selecione um estado', order: 2 },
    { key: 'level3', label: 'Município', placeholder: 'Selecione um município', order: 3 },
  ],
  screens: {
    ...FALLBACK_INSTALLATION_CONFIG.screens,
    home: {
      ...FALLBACK_INSTALLATION_CONFIG.screens.home,
      identifier: {
        key: 'identifier',
        label: 'Identificador',
        placeholder: 'Informe o identificador',
      },
      detail: {
        sectionTitle: 'Detalhes da consulta',
        areaOfInterestSectionTitle: 'Dados da área de interesse',
        registrationDateLabel: 'Data de registro',
        alterationDateLabel: 'Data de alteração',
        latitudeLabel: 'Latitude',
        longitudeLabel: 'Longitude',
        areaLabel: 'Área',
        featuresDownloadLabel: 'Baixar feições',
      },
    },
  },
  areaOfInterest: {
    areaUnit: 'ha',
    areaUnitLabel: 'ha',
  },
}

describe('detailByIdentifier config', () => {
  it('should expose header and property field groups', () => {
    const header = getDetailFieldsByGroup('header')
    const property = getDetailFieldsByGroup('property')

    expect(header.map((field) => field.key)).toEqual([
      'id',
      'registrationDate',
      'alterationDate',
    ])
    expect(property.map((field) => field.key)).toEqual([
      'level3Name',
      'level2Name',
      'latitude',
      'longitude',
      'area',
    ])
  })

  it('should use installation hierarchy and identifier labels', () => {
    const config = buildDetailByIdentifierConfig(ptbrInstallation)
    const byKey = Object.fromEntries(config.fields.map((field) => [field.key, field.label]))

    expect(byKey.id).toBe('Identificador')
    expect(byKey.level3Name).toBe('Município')
    expect(byKey.level2Name).toBe('Estado')
    expect(byKey.registrationDate).toBe('Data de registro')
    expect(config.sectionTitle).toBe('Detalhes da consulta')
    expect(config.areaOfInterestSectionTitle).toBe('Dados da área de interesse')
  })

  it('should group property fields in rows like CP layout', () => {
    const rows = getPropertyFieldRows()

    expect(rows.map((row) => row.map((field) => field.key))).toEqual([
      ['level3Name', 'level2Name'],
      ['latitude', 'longitude'],
      ['area'],
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

  it('should include alteration date in header fields', () => {
    const header = getDetailFieldsByGroup('header')
    const alteration = header.find((field) => field.key === 'alterationDate')

    expect(alteration).toBeDefined()
    expect(alteration?.label).toBe('Alteration date')
    expect(alteration?.formatAsDate).toBe(true)
  })

  it('should use areaUnitLabel from installation config', () => {
    const config = buildDetailByIdentifierConfig({
      ...FALLBACK_INSTALLATION_CONFIG,
      areaOfInterest: {
        areaUnit: 'campos',
        areaUnitLabel: 'campos de futebol',
      },
    })
    const area = config.fields.find((field) => field.key === 'area')

    expect(area?.unitSuffix).toBe('campos de futebol')
  })
})
