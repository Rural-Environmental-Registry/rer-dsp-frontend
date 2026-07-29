import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getTerritoryBoundaryBox, getTerritoryOptions } from '@/services/territoryService'
import { httpGet } from '@/services/httpClient'

vi.mock('@/services/httpClient', () => ({
  httpGet: vi.fn(),
}))

describe('territoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should request territory options with level and parentId', async () => {
    vi.mocked(httpGet).mockResolvedValue([{ id: 'DF', name: 'Distrito Federal' }])

    const result = await getTerritoryOptions('level2', '1')

    expect(httpGet).toHaveBeenCalledWith('territory/options?level=level2&parentId=1')
    expect(result).toEqual([{ id: 'DF', name: 'Distrito Federal' }])
  })

  it('should request boundary-box with level2Ids and level3Ids', async () => {
    const bbox = { minX: -48.2, minY: -16.0, maxX: -47.3, maxY: -15.5 }
    vi.mocked(httpGet).mockResolvedValue(bbox)

    const result = await getTerritoryBoundaryBox({
      level2Ids: ['DF', 'GO'],
      level3Ids: ['5300108', '5300109'],
    })

    expect(httpGet).toHaveBeenCalledWith(
      'territory/boundary-box?level2Ids=DF&level2Ids=GO&level3Ids=5300108&level3Ids=5300109',
    )
    expect(result).toEqual(bbox)
  })

  it('should request boundary-box with only level2Ids', async () => {
    const bbox = { minX: -48.3, minY: -16.1, maxX: -47.2, maxY: -15.4 }
    vi.mocked(httpGet).mockResolvedValue(bbox)

    await getTerritoryBoundaryBox({ level2Ids: ['DF'], level3Ids: [] })

    expect(httpGet).toHaveBeenCalledWith('territory/boundary-box?level2Ids=DF')
  })
})
