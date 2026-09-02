import { describe, expect, it } from 'vitest'
import {
  citiesToSelectOptions,
  regionsToSelectOptions,
  statesToSelectOptions,
  totalizersToKpis,
} from '@/adapters/selectOptionAdapters'
import { PRIMARY_KPI_CODE } from '@/config/installationConfigFallback'

describe('selectOptionAdapters', () => {
  describe('statesToSelectOptions', () => {
    it('should map state id and name to select option', () => {
      const result = statesToSelectOptions([
        { id: 'DF', name: 'Distrito Federal', region: 'CW' },
      ])

      expect(result).toEqual([{ value: 'DF', label: 'DF - Distrito Federal' }])
    })
  })

  describe('citiesToSelectOptions', () => {
    it('should map city id as string value', () => {
      const result = citiesToSelectOptions([{ id: 5300108, name: 'Brasília' }])
      expect(result).toEqual([{ value: '5300108', label: 'Brasília' }])
    })
  })

  describe('regionsToSelectOptions', () => {
    it('should map region id and name', () => {
      const result = regionsToSelectOptions([{ id: 1, name: 'Norte', code: 'N' }])
      expect(result).toEqual([{ value: '1', label: 'Norte' }])
    })
  })

  describe('totalizersToKpis', () => {
    it('should merge totalizer values with KPI config labels', () => {
      const result = totalizersToKpis([
        {
          name: 'Nome da API',
          code: PRIMARY_KPI_CODE,
          value: 100,
          subItemName: 'yyy',
          subItemValue: 200,
          unitOfMeasurement: 'xxx',
        },
      ])

      expect(result.length).toBeGreaterThanOrEqual(1)
      expect(result[0]).toMatchObject({
        id: PRIMARY_KPI_CODE,
        title: 'Registered properties',
        value: 100,
        unitOfMeasurement: 'un.',
        optionalLabel: 'ha',
        optionalValue: 200,
      })
      expect(result[0].accentColor).toBeTruthy()
    })

    it('should ignore empty optional subItemValue on primary card', () => {
      const result = totalizersToKpis([
        {
          name: 'Registered properties',
          code: PRIMARY_KPI_CODE,
          value: 10,
          subItemValue: 0,
          unitOfMeasurement: 'un.',
        },
      ])

      expect(result[0].optionalValue).toBeUndefined()
      expect(result[0].optionalLabel).toBeUndefined()
    })

    it('should limit to 5 KPIs from config', () => {
      const totalizers = Array.from({ length: 8 }, (_, index) => ({
        name: `KPI ${index}`,
        code: index === 0 ? PRIMARY_KPI_CODE : `EXTRA_${index}`,
        value: index,
      }))

      expect(totalizersToKpis(totalizers)).toHaveLength(5)
      expect(totalizersToKpis(totalizers)[0].id).toBe(PRIMARY_KPI_CODE)
    })
  })
})
