import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import DownloadsFilterPanel from '@/components/DownloadsFilterPanel.vue'
import { getInstallationConfig } from '@/services/configService'
import { getTerritoryOptions } from '@/services/territoryService'
import { FALLBACK_INSTALLATION_CONFIG } from '@/config/installationConfigFallback'
import { MAX_DOWNLOAD_LEVEL1 } from '@/config/downloadsUi'

vi.mock('@/services/configService', () => ({
  getInstallationConfig: vi.fn(),
}))

vi.mock('@/services/territoryService', () => ({
  getTerritoryOptions: vi.fn(),
}))

vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    name: 'FontAwesomeIcon',
    template: '<i />',
  },
}))

describe('DownloadsFilterPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getInstallationConfig).mockResolvedValue(FALLBACK_INSTALLATION_CONFIG)
    vi.mocked(getTerritoryOptions).mockImplementation(async (level, parentId) => {
      if (level === 'level1') {
        return [
          { id: '1', name: 'Norte' },
          { id: '3', name: 'Centro-Oeste' },
        ]
      }
      if (level === 'level2' && parentId === '3') {
        return [{ id: 'DF', name: 'DF - Distrito Federal' }]
      }
      if (level === 'level3' && parentId === 'DF') {
        return [{ id: '5300108', name: 'Brasília' }]
      }
      return []
    })
  })

  it('should show level1 chips and reveal level2 chips after selection', async () => {
    const wrapper = mount(DownloadsFilterPanel, {
      props: {
        themeOptions: [{ value: 'theme_alpha', label: 'Theme Alpha' }],
      },
    })
    await flushPromises()

    expect(getTerritoryOptions).toHaveBeenCalledWith('level1')
    expect(wrapper.text()).toContain('Norte')
    expect(wrapper.text()).toContain('Centro-Oeste')
    expect(wrapper.text()).not.toContain('Distrito Federal')

    const level1Buttons = wrapper.findAll('.chip-btn')
    await level1Buttons[1].trigger('click')
    await flushPromises()

    expect(getTerritoryOptions).toHaveBeenCalledWith('level2', '3')
    expect(wrapper.text()).toContain('Distrito Federal')
    expect(wrapper.text()).not.toContain('Filter by')
  })

  it('should reveal filters and emit search when level2 is selected', async () => {
    const wrapper = mount(DownloadsFilterPanel, {
      props: {
        themeOptions: [{ value: 'theme_alpha', label: 'Theme Alpha' }],
      },
    })
    await flushPromises()

    const chips = wrapper.findAll('.chip-btn')
    await chips[1].trigger('click')
    await flushPromises()

    const level2Chip = wrapper
      .findAll('.chip-btn')
      .find((button) => button.text().includes('Distrito Federal'))
    await level2Chip!.trigger('click')
    await flushPromises()

    expect(getTerritoryOptions).toHaveBeenCalledWith('level3', 'DF')
    expect(wrapper.text()).toContain('Filter by')
    expect(wrapper.emitted('search')).toBeTruthy()
  })

  it('should respect max level1 chips', async () => {
    vi.mocked(getTerritoryOptions).mockImplementation(async (level) => {
      if (level === 'level1') {
        return Array.from({ length: MAX_DOWNLOAD_LEVEL1 + 2 }, (_, index) => ({
          id: String(index + 1),
          name: `Region ${index + 1}`,
        }))
      }
      return []
    })

    const wrapper = mount(DownloadsFilterPanel)
    await flushPromises()

    expect(wrapper.findAll('.chip-btn')).toHaveLength(MAX_DOWNLOAD_LEVEL1)
  })
})
