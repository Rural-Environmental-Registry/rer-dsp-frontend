import type { InstallationConfig } from '@/types/installationConfig'

export const PRIMARY_KPI_CODE = 'AREA_OF_INTEREST'

/**
 * Fallback local quando a API de config ainda não está disponível.
 * Mantém Home com 2 níveis e Downloads com 3.
 */
export const FALLBACK_INSTALLATION_CONFIG: InstallationConfig = {
  hierarchy: [
    { key: 'level1', label: 'Level 1', placeholder: 'Select level 1', order: 1 },
    { key: 'level2', label: 'Level 2', placeholder: 'Select level 2', order: 2 },
    { key: 'level3', label: 'Level 3', placeholder: 'Select level 3', order: 3 },
  ],
  screens: {
    home: {
      title: 'Browse registered data',
      hierarchyKeys: ['level2', 'level3'],
      identifier: {
        key: 'identifier',
        label: 'Identifier',
        placeholder: 'Enter the identifier',
      },
      detail: {
        sectionTitle: 'Search details',
        propertySectionTitle: 'Record data',
        registrationDateLabel: 'Registration date',
        alterationDateLabel: 'Alteration date',
        latitudeLabel: 'Latitude',
        longitudeLabel: 'Longitude',
        areaLabel: 'Area',
        featuresDownloadLabel: 'Download features',
      },
    },
    downloads: {
      title: 'Download public data',
      hierarchyKeys: ['level1', 'level2', 'level3'],
      theme: {
        key: 'theme',
        label: 'Theme',
        placeholder: 'All themes',
      },
      level1SectionTitle: 'Select the level 1 you want to access for Downloads',
      level2SectionTitle: 'Options for the selected level 1',
      filterByTitle: 'Filter by:',
    },
  },
  kpis: {
    maxCards: 5,
    primaryCode: PRIMARY_KPI_CODE,
    cards: [
      {
        code: PRIMARY_KPI_CODE,
        label: 'Registered properties',
        unitOfMeasurement: 'un.',
        optionalLabel: 'ha',
        accentColor: '#CED6E5',
        order: 1,
        required: true,
      },
      {
        code: 'LEGAL_RESERVE',
        label: 'Legal reserve',
        unitOfMeasurement: 'ha',
        accentColor: '#C1D2F2',
        order: 2,
        required: false,
      },
      {
        code: 'PERMANENT_PRESERVATION_AREA',
        label: 'Permanent preservation area',
        unitOfMeasurement: 'ha',
        accentColor: '#98B7EC',
        order: 3,
        required: false,
      },
      {
        code: 'NATIVE_VEGETATION',
        label: 'Native vegetation',
        unitOfMeasurement: 'ha',
        accentColor: '#97CCE3',
        order: 4,
        required: false,
      },
      {
        code: 'CONSOLIDATED_AREA',
        label: 'Consolidated area',
        unitOfMeasurement: 'ha',
        accentColor: '#B6C3D9',
        order: 5,
        required: false,
      },
    ],
  },
  areaOfInterest: {
    areaUnit: 'ha',
    areaUnitLabel: 'ha',
  },
  formats: {
    date: 'dd/MM/yyyy',
    dateTime: 'dd/MM/yyyy HH:mm:ss',
  },
}
