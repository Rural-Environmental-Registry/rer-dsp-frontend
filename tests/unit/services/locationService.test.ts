import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { httpGet } from '@/services/httpClient'
import {
  getCitiesByState,
  getRegionsWithStates,
  getStates,
  getStatesByRegion,
} from '@/services/locationService'

vi.mock('@/services/httpClient')

describe('locationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getStates', () => {
    it('should fetch and sort states by name', async () => {
      vi.mocked(httpGet).mockResolvedValue([
        { id: 'SP', name: 'São Paulo' },
        { id: 'DF', name: 'Distrito Federal' },
      ])

      const result = await getStates()

      expect(httpGet).toHaveBeenCalledWith('state/getAll')
      expect(result.map((item) => item.id)).toEqual(['DF', 'SP'])
    })
  })

  describe('getCitiesByState', () => {
    it('should fetch cities for a state', async () => {
      vi.mocked(httpGet).mockResolvedValue([
        { id: 2, name: 'Anápolis' },
        { id: 1, name: 'Goiânia' },
      ])

      const result = await getCitiesByState('GO')

      expect(httpGet).toHaveBeenCalledWith('state/getCitiesByUf/GO')
      expect(result.map((item) => item.name)).toEqual(['Anápolis', 'Goiânia'])
    })
  })

  describe('getStatesByRegion', () => {
    it('should fetch states by region code', async () => {
      vi.mocked(httpGet).mockResolvedValue([{ id: 'DF', name: 'Distrito Federal' }])

      const result = await getStatesByRegion('CW')

      expect(httpGet).toHaveBeenCalledWith('state/getUfsByRegion/CW')
      expect(result).toHaveLength(1)
    })
  })

  describe('getRegionsWithStates', () => {
    it('should fetch regions and return empty array when null', async () => {
      vi.mocked(httpGet).mockResolvedValue(null as unknown as [])

      const result = await getRegionsWithStates()

      expect(httpGet).toHaveBeenCalledWith('geoServices/getRegions')
      expect(result).toEqual([])
    })
  })
})
