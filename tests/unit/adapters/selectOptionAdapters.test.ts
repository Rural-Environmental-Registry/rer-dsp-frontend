import { describe, expect, it } from 'vitest'
import {
  citiesToSelectOptions,
  regionsToSelectOptions,
  statesToSelectOptions,
  totalizersToKpis,
} from '@/adapters/selectOptionAdapters'

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
    it('should convert totalizers into KPIs with colors', () => {
      const result = totalizersToKpis([
        {
          name: 'Registered properties',
          code: 'REGISTERED_AREA',
          value: 100,
          subItemName: 'ha',
          subItemValue: 200,
          unitOfMeasurement: 'un.',
        },
      ])

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        id: 'REGISTERED_AREA',
        title: 'Registered properties',
        value: 100,
        unitOfMeasurement: 'un.',
        optionalLabel: 'ha',
        optionalValue: 200,
      })
      expect(result[0].accentColor).toBeTruthy()
    })

    it('should ignore empty optional subItemValue', () => {
      const result = totalizersToKpis([
        {
          name: 'Area',
          value: 10,
          subItemValue: 0,
          unitOfMeasurement: 'ha',
        },
      ])

      expect(result[0].optionalValue).toBeUndefined()
      expect(result[0].optionalLabel).toBeUndefined()
    })

    it('should limit to 5 KPIs', () => {
      const totalizers = Array.from({ length: 8 }, (_, index) => ({
        name: `KPI ${index}`,
        value: index,
      }))

      expect(totalizersToKpis(totalizers)).toHaveLength(5)
    })
  })
})
