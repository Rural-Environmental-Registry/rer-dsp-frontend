import { describe, expect, it } from 'vitest'
import {
  MAX_HOME_KPIS,
  mockTotalizerValues,
  resolveHomeKpis,
} from '@/config/homeKpis'
import {
  FALLBACK_INSTALLATION_CONFIG,
  PRIMARY_KPI_CODE,
} from '@/config/installationConfigFallback'
import type { HomeKpisConfig } from '@/types/installationConfig'
import type { TotalizerDTO } from '@/types/totalizer'

describe('homeKpis', () => {
  describe('resolveHomeKpis', () => {
    it('should return empty array when primary card is missing from config', () => {
      const config: HomeKpisConfig = {
        maxCards: 5,
        primaryCode: PRIMARY_KPI_CODE,
        cards: [
          {
            code: 'OTHER',
            label: 'Other',
            accentColor: '#000',
            order: 1,
          },
        ],
      }

      expect(resolveHomeKpis(mockTotalizerValues, config)).toEqual([])
    })

    it('should keep up to MAX_HOME_KPIS items and put primary first', () => {
      const result = resolveHomeKpis(mockTotalizerValues, FALLBACK_INSTALLATION_CONFIG.kpis)

      expect(result.length).toBeLessThanOrEqual(MAX_HOME_KPIS)
      expect(result[0].id).toBe(PRIMARY_KPI_CODE)
      expect(result[0].title).toBe('Registered properties')
    })

    it('should force primary card to first position even when order is wrong', () => {
      const config: HomeKpisConfig = {
        maxCards: 5,
        primaryCode: PRIMARY_KPI_CODE,
        cards: [
          {
            code: 'LEGAL_RESERVE',
            label: 'Legal reserve',
            unitOfMeasurement: 'ha',
            accentColor: '#C1D2F2',
            order: 1,
          },
          {
            code: PRIMARY_KPI_CODE,
            label: 'Registered properties',
            unitOfMeasurement: 'un.',
            optionalLabel: 'ha',
            accentColor: '#CED6E5',
            order: 9,
            required: true,
          },
        ],
      }

      const result = resolveHomeKpis(mockTotalizerValues, config)

      expect(result[0].id).toBe(PRIMARY_KPI_CODE)
      expect(result[1].id).toBe('LEGAL_RESERVE')
    })

    it('should truncate when there are more than 5 configured cards', () => {
      const config: HomeKpisConfig = {
        maxCards: 5,
        primaryCode: PRIMARY_KPI_CODE,
        cards: [
          {
            code: PRIMARY_KPI_CODE,
            label: 'Registered properties',
            accentColor: '#CED6E5',
            order: 1,
            required: true,
          },
          ...Array.from({ length: 6 }, (_, index) => ({
            code: `EXTRA_${index}`,
            label: `Extra ${index}`,
            accentColor: '#000',
            order: index + 2,
          })),
        ],
      }

      const totalizers: TotalizerDTO[] = [
        { code: PRIMARY_KPI_CODE, name: 'Registered properties', value: 10 },
        ...Array.from({ length: 6 }, (_, index) => ({
          code: `EXTRA_${index}`,
          name: `Extra ${index}`,
          value: index,
        })),
      ]

      const result = resolveHomeKpis(totalizers, config)
      expect(result).toHaveLength(5)
      expect(result[0].id).toBe(PRIMARY_KPI_CODE)
    })

    it('should use labels and units from config, not from totalizer payload', () => {
      const totalizers: TotalizerDTO[] = [
        {
          code: PRIMARY_KPI_CODE,
          name: 'Nome vindo da API',
          value: 99,
          unitOfMeasurement: 'xxx',
          subItemName: 'yyy',
          subItemValue: 12,
        },
      ]

      const result = resolveHomeKpis(totalizers, FALLBACK_INSTALLATION_CONFIG.kpis)

      expect(result[0].title).toBe('Registered properties')
      expect(result[0].unitOfMeasurement).toBe('un.')
      expect(result[0].optionalLabel).toBe('ha')
      expect(result[0].value).toBe(99)
      expect(result[0].optionalValue).toBe(12)
    })
  })
})
