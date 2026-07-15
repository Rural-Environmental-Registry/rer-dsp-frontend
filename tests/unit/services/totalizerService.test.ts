import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { httpGet, httpPost } from '@/services/httpClient'
import {
  getDetailsByIdentifier,
  getTotalizersByStateOrCity,
} from '@/services/totalizerService'

vi.mock('@/services/httpClient')

describe('totalizerService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getTotalizersByStateOrCity', () => {
    it('should post filter and return totalizers', async () => {
      const filter = { idState: 'DF', idsCities: [5300108] }
      const mockData = [{ name: 'Imóveis', value: 10 }]
      vi.mocked(httpPost).mockResolvedValue(mockData)

      const result = await getTotalizersByStateOrCity(filter)

      expect(httpPost).toHaveBeenCalledWith('totalizer/getTotalizerByStateOrCity', filter)
      expect(result).toEqual(mockData)
    })

    it('should return empty array when API returns null', async () => {
      vi.mocked(httpPost).mockResolvedValue(null as unknown as [])
      await expect(
        getTotalizersByStateOrCity({ idState: null, idsCities: [] }),
      ).resolves.toEqual([])
    })
  })

  describe('getDetailsByIdentifier', () => {
    it('should fetch detail by identifier', async () => {
      const detail = { codeProperty: 'DF123456789012', nameState: 'Distrito Federal' }
      vi.mocked(httpGet).mockResolvedValue(detail)

      const result = await getDetailsByIdentifier('DF123456789012')

      expect(httpGet).toHaveBeenCalledWith(
        'totalizer/getDeatilsByIdentifier/DF123456789012',
      )
      expect(result).toEqual(detail)
    })

    it('should return null on HTTP 404', async () => {
      vi.mocked(httpGet).mockRejectedValue(new Error('HTTP 404 em http://api/x'))

      await expect(getDetailsByIdentifier('UNKNOWN')).resolves.toBeNull()
    })

    it('should rethrow unexpected errors', async () => {
      vi.mocked(httpGet).mockRejectedValue(new Error('HTTP 500 em http://api/x'))

      await expect(getDetailsByIdentifier('DF123')).rejects.toThrow('HTTP 500')
    })
  })
})
