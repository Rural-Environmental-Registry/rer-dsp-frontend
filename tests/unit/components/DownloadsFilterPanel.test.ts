import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import DownloadsFilterPanel from '@/components/DownloadsFilterPanel.vue'
import { getInstallationConfig } from '@/services/configService'
import { getTerritoryOptions } from '@/services/territoryService'
import { FALLBACK_INSTALLATION_CONFIG } from '@/config/installationConfigFallback'

vi.mock('@/services/configService', async () => {
  const { FALLBACK_INSTALLATION_CONFIG } = await import('@/config/installationConfigFallback')
  return {
    getInstallationConfig: vi.fn(),
    peekInstallationConfig: vi.fn().mockReturnValue(FALLBACK_INSTALLATION_CONFIG),
  }
})

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
          { id: '1', name: 'North' },
          { id: '3', name: 'Central' },
        ]
      }
      if (level === 'level2' && parentId === '3') {
        return [{ id: 'ST01', name: 'ST-01 - State One' }]
      }
      if (level === 'level3' && parentId === 'ST01') {
        return [{ id: 'CITY001', name: 'Sample City' }]
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
    expect(wrapper.text()).toContain('North')
    expect(wrapper.text()).toContain('Central')
    expect(wrapper.text()).not.toContain('State One')

    const level1Buttons = wrapper.findAll('.chip-btn')
    await level1Buttons[1].trigger('click')
    await flushPromises()

    expect(getTerritoryOptions).toHaveBeenCalledWith('level2', '3')
    expect(wrapper.text()).toContain('State One')
    expect(wrapper.text()).not.toContain('Filter by')
  })

  it('should reveal filters without search when level2 is selected', async () => {
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
      .find((button) => button.text().includes('State One'))
    await level2Chip!.trigger('click')
    await flushPromises()

    expect(getTerritoryOptions).toHaveBeenCalledWith('level3', 'ST01')
    expect(wrapper.text()).toContain('Filter by')
    expect(wrapper.emitted('search')).toBeFalsy()
    expect(wrapper.emitted('selection-change')).toBeTruthy()
  })

  it('should emit search when search button is clicked with level2 only', async () => {
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
      .find((button) => button.text().includes('State One'))
    await level2Chip!.trigger('click')
    await flushPromises()

    const searchButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Search'))
    await searchButton!.trigger('click')

    expect(wrapper.emitted('search')?.[0]?.[0]).toMatchObject({
      level1: '3',
      level2: 'ST01',
      level3: '',
      theme: '',
    })
  })

  it('should allow selecting all themes after a specific theme was chosen', async () => {
    const wrapper = mount(DownloadsFilterPanel, {
      props: {
        themeOptions: [
          { value: 'area_of_interest', label: 'Area of interest' },
          { value: 'safety_buffer', label: 'Safety buffer zone' },
        ],
      },
    })
    await flushPromises()

    const chips = wrapper.findAll('.chip-btn')
    await chips[1].trigger('click')
    await flushPromises()

    const level2Chip = wrapper
      .findAll('.chip-btn')
      .find((button) => button.text().includes('State One'))
    await level2Chip!.trigger('click')
    await flushPromises()

    const themeSelect = wrapper.find('#download-theme')
    await themeSelect.setValue('area_of_interest')
    await themeSelect.setValue('')

    const searchButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Search'))
    await searchButton!.trigger('click')

    expect(wrapper.emitted('search')?.[0]?.[0]).toMatchObject({
      level1: '3',
      level2: 'ST01',
      level3: '',
      theme: '',
    })
  })

  it('should emit search with level3 when selected before search', async () => {
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
      .find((button) => button.text().includes('State One'))
    await level2Chip!.trigger('click')
    await flushPromises()

    await wrapper.find('#download-level3').setValue('CITY001')

    const searchButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Search'))
    await searchButton!.trigger('click')

    expect(wrapper.emitted('search')?.[0]?.[0]).toMatchObject({
      level1: '3',
      level2: 'ST01',
      level3: 'CITY001',
      theme: '',
    })
  })

  it('should render all level1 options returned by the API', async () => {
    vi.mocked(getTerritoryOptions).mockImplementation(async (level) => {
      if (level === 'level1') {
        return Array.from({ length: 7 }, (_, index) => ({
          id: String(index + 1),
          name: `Region ${index + 1}`,
        }))
      }
      return []
    })

    const wrapper = mount(DownloadsFilterPanel)
    await flushPromises()

    expect(wrapper.findAll('.chip-btn')).toHaveLength(7)
  })
})
