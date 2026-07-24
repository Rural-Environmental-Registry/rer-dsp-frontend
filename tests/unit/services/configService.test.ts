import { beforeEach, describe, expect, it, vi } from 'vitest'
import { httpGet } from '@/services/httpClient'
import {
  getInstallationConfig,
  resetInstallationConfigCache,
} from '@/services/configService'
import { FALLBACK_INSTALLATION_CONFIG } from '@/config/installationConfigFallback'

vi.mock('@/services/httpClient', () => ({
  httpGet: vi.fn(),
}))

describe('configService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetInstallationConfigCache()
  })

  it('should load installation config from API', async () => {
    const apiConfig = {
      ...FALLBACK_INSTALLATION_CONFIG,
      hierarchy: [
        { key: 'level1' as const, label: 'Region', placeholder: 'Select region', order: 1 },
        { key: 'level2' as const, label: 'State', placeholder: 'Select state', order: 2 },
        { key: 'level3' as const, label: 'City', placeholder: 'Select city', order: 3 },
      ],
    }
    vi.mocked(httpGet).mockResolvedValue(apiConfig)

    const result = await getInstallationConfig()

    expect(httpGet).toHaveBeenCalledWith('config/installation')
    expect(result.hierarchy[1].label).toBe('State')
    expect(result.screens.home.hierarchyKeys).toEqual(['level2', 'level3'])
    expect(result.screens.downloads.hierarchyKeys).toEqual(['level1', 'level2', 'level3'])
    expect(result.kpis.maxCards).toBe(5)
    expect(result.kpis.cards[0].code).toBe(FALLBACK_INSTALLATION_CONFIG.kpis.primaryCode)
    expect(result.areaOfInterest.areaUnit).toBe('ha')
  })

  it('should cache installation config', async () => {
    vi.mocked(httpGet).mockResolvedValue(FALLBACK_INSTALLATION_CONFIG)

    await getInstallationConfig()
    await getInstallationConfig()

    expect(httpGet).toHaveBeenCalledTimes(1)
  })

  it('should use fallback when API fails', async () => {
    vi.mocked(httpGet).mockRejectedValue(new Error('offline'))

    const result = await getInstallationConfig()

    expect(result).toEqual(FALLBACK_INSTALLATION_CONFIG)
    expect(result.areaOfInterest).toEqual({ areaUnit: 'ha', areaUnitLabel: 'ha' })
  })
})
