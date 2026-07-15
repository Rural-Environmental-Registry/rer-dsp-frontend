import { describe, expect, it } from 'vitest'
import { MAX_HOME_KPIS, mockHomeKpis, resolveHomeKpis, type KpiItem } from '@/config/homeKpis'

describe('homeKpis', () => {
  describe('resolveHomeKpis', () => {
    it('should return empty array when input is empty', () => {
      expect(resolveHomeKpis([])).toEqual([])
    })

    it('should keep up to MAX_HOME_KPIS items', () => {
      const result = resolveHomeKpis(mockHomeKpis)
      expect(result.length).toBeLessThanOrEqual(MAX_HOME_KPIS)
      expect(result).toHaveLength(Math.min(mockHomeKpis.length, MAX_HOME_KPIS))
    })

    it('should truncate when there are more than 5 KPIs', () => {
      const extras: KpiItem[] = Array.from({ length: 7 }, (_, index) => ({
        id: `kpi-${index}`,
        title: `KPI ${index}`,
        value: index,
        accentColor: '#000',
      }))

      const result = resolveHomeKpis(extras)
      expect(result).toHaveLength(5)
      expect(result[0].id).toBe('kpi-0')
      expect(result[4].id).toBe('kpi-4')
    })
  })
})
