import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { httpGet, httpPost } from '@/services/httpClient'
import {
  getDetailsByCoordinates,
  getDetailsByIdentifier,
  getTotalizers,
} from '@/services/totalizerService'

vi.mock('@/services/httpClient')

describe('totalizerService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getTotalizers', () => {
    it('should post filter and return totalizers', async () => {
      const filter = { level2Ids: ['DF'], level3Ids: ['5300108'] }
      const mockData = [{ name: 'Properties', value: 10 }]
      vi.mocked(httpPost).mockResolvedValue(mockData)

      const result = await getTotalizers(filter)

      expect(httpPost).toHaveBeenCalledWith('totalizer/getTotalizers', filter)
      expect(result).toEqual(mockData)
    })

    it('should return empty array when API returns null', async () => {
      vi.mocked(httpPost).mockResolvedValue(null as unknown as [])
      await expect(
        getTotalizers({ level2Ids: [], level3Ids: [] }),
      ).resolves.toEqual([])
    })
  })

  describe('getDetailsByIdentifier', () => {
    it('should fetch detail by identifier', async () => {
      const detail = { id: 'DF123456789012', territory: { level2: { name: 'Distrito Federal' } } }
      vi.mocked(httpGet).mockResolvedValue(detail)

      const result = await getDetailsByIdentifier('DF123456789012')

      expect(httpGet).toHaveBeenCalledWith(
        'totalizer/getDeatilsByIdentifier/DF123456789012',
      )
      expect(result).toEqual(detail)
    })

    it('should return null on HTTP 404', async () => {
      vi.mocked(httpGet).mockRejectedValue(new Error('HTTP 404 at http://api/x'))

      await expect(getDetailsByIdentifier('UNKNOWN')).resolves.toBeNull()
    })

    it('should rethrow unexpected errors', async () => {
      vi.mocked(httpGet).mockRejectedValue(new Error('HTTP 500 at http://api/x'))

      await expect(getDetailsByIdentifier('DF123')).rejects.toThrow('HTTP 500')
    })
  })

  describe('getDetailsByCoordinates', () => {
    it('should fetch detail by coordinates', async () => {
      const detail = {
        id: 'DF-123',
        otherIds: ['DF-456'],
      }
      vi.mocked(httpGet).mockResolvedValue(detail)

      const result = await getDetailsByCoordinates({ lat: -15.75, lng: -47.85 })

      expect(httpGet).toHaveBeenCalledWith('totalizer/getDetailsByCoordinates', {
        lat: -15.75,
        lng: -47.85,
      })
      expect(result).toEqual(detail)
    })

    it('should return null on HTTP 404', async () => {
      vi.mocked(httpGet).mockRejectedValue(new Error('HTTP 404 at http://api/x'))

      await expect(
        getDetailsByCoordinates({ lat: 0, lng: 0 }),
      ).resolves.toBeNull()
    })
  })
})
