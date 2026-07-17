import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import DownloadsFilterPanel from '@/components/DownloadsFilterPanel.vue'
import {
  getCitiesByState,
  getRegionsWithStates,
} from '@/services/locationService'
import { MAX_DOWNLOAD_LEVEL1 } from '@/config/downloadsUi'

vi.mock('@/services/locationService', () => ({
  getRegionsWithStates: vi.fn(),
  getStatesByRegion: vi.fn(),
  getCitiesByState: vi.fn(),
  getStates: vi.fn(),
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
    vi.mocked(getRegionsWithStates).mockResolvedValue([
      {
        id: 1,
        name: 'Norte',
        states: [
          { id: 'AC', name: 'Acre' },
          { id: 'AM', name: 'Amazonas' },
        ],
      },
      {
        id: 3,
        name: 'Centro-Oeste',
        states: [{ id: 'DF', name: 'Distrito Federal' }],
      },
    ])
    vi.mocked(getCitiesByState).mockResolvedValue([{ id: 5300108, name: 'Brasília' }])
  })

  it('should show level1 chips and reveal level2 chips after selection', async () => {
    const wrapper = mount(DownloadsFilterPanel, {
      props: {
        themeOptions: [{ value: 'theme_alpha', label: 'Theme Alpha' }],
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Norte')
    expect(wrapper.text()).toContain('Centro-Oeste')
    expect(wrapper.text()).not.toContain('Distrito Federal')

    const level1Buttons = wrapper.findAll('.chip-btn')
    await level1Buttons[1].trigger('click')
    await flushPromises()

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

    expect(getCitiesByState).toHaveBeenCalledWith('DF')
    expect(wrapper.text()).toContain('Filter by')
    expect(wrapper.text()).toContain('Level 3')
    expect(wrapper.text()).toContain('Theme')
    expect(wrapper.emitted('search')?.[0]?.[0]).toMatchObject({
      level1: '3',
      level2: 'DF',
    })
  })

  it('should cap level1 chips at MAX_DOWNLOAD_LEVEL1', async () => {
    vi.mocked(getRegionsWithStates).mockResolvedValue(
      Array.from({ length: 8 }, (_, index) => ({
        id: index + 1,
        name: `Region ${index + 1}`,
        states: [{ id: `S${index}`, name: `State ${index + 1}` }],
      })),
    )

    const wrapper = mount(DownloadsFilterPanel)
    await flushPromises()

    expect(wrapper.findAll('.chip-btn')).toHaveLength(MAX_DOWNLOAD_LEVEL1)
  })

  it('should not render noRegionSelected image placeholder', async () => {
    const wrapper = mount(DownloadsFilterPanel)
    await flushPromises()

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.html()).not.toContain('noRegionSelected')
  })
})
