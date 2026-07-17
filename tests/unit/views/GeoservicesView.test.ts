import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import GeoservicesView from '@/views/GeoservicesView.vue'
import DownloadsFilterPanel from '@/components/DownloadsFilterPanel.vue'
import {
  getDownloadThemes,
  searchDownloads,
  downloadThemeFile,
  triggerBrowserDownload,
} from '@/services/downloadService'

vi.mock('@/services/downloadService', () => ({
  getDownloadThemes: vi.fn(),
  searchDownloads: vi.fn(),
  downloadThemeFile: vi.fn(),
  triggerBrowserDownload: vi.fn(),
}))

vi.mock('@/services/locationService', () => ({
  getStates: vi.fn().mockResolvedValue([]),
  getCitiesByState: vi.fn().mockResolvedValue([]),
  getRegionsWithStates: vi.fn().mockResolvedValue([
    {
      id: 3,
      name: 'Centro-Oeste',
      states: [{ id: 'DF', name: 'Distrito Federal' }],
    },
  ]),
  getStatesByRegion: vi.fn().mockResolvedValue([]),
}))

vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    name: 'FontAwesomeIcon',
    template: '<i />',
  },
}))

describe('GeoservicesView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getDownloadThemes).mockResolvedValue([
      { code: 'theme_alpha', name: 'Theme Alpha', formats: ['csv', 'gpkg'], enabled: true },
    ])
    vi.mocked(searchDownloads).mockResolvedValue([
      {
        themeCode: 'theme_alpha',
        themeName: 'Theme Alpha',
        formats: [
          { format: 'csv', status: 'available' },
          { format: 'gpkg', status: 'unavailable' },
        ],
        lastUpdate: '2026-06-01',
      },
    ])
  })

  it('should load themes and search downloads from filter panel', async () => {
    const wrapper = mount(GeoservicesView)
    await flushPromises()

    expect(getDownloadThemes).toHaveBeenCalledTimes(1)

    const panel = wrapper.findComponent(DownloadsFilterPanel)
    await panel.vm.$emit('search', {
      level1: '3',
      level2: 'DF',
      level3: '',
      theme: '',
    })
    await flushPromises()

    expect(searchDownloads).toHaveBeenCalledWith({
      level1: '3',
      level2: 'DF',
      level3: null,
      theme: null,
    })
    expect(wrapper.text()).toContain('Theme Alpha')
    expect(wrapper.text()).toContain('CSV')
    expect(wrapper.text()).toContain('GPKG')
    expect(wrapper.text()).toContain('06/01/2026')
  })

  it('should download available format and keep unavailable disabled', async () => {
    vi.mocked(downloadThemeFile).mockResolvedValue({
      blob: new Blob(['ok']),
      fileName: 'DF_theme_alpha.csv',
    })

    const wrapper = mount(GeoservicesView)
    await flushPromises()

    const panel = wrapper.findComponent(DownloadsFilterPanel)
    await panel.vm.$emit('search', {
      level1: '3',
      level2: 'DF',
      level3: '',
      theme: 'theme_alpha',
    })
    await flushPromises()

    const buttons = wrapper.findAll('button.download-theme')
    const csvButton = buttons.find((button) => button.text().includes('CSV'))
    const gpkgButton = buttons.find((button) => button.text().includes('GPKG'))

    expect(csvButton?.attributes('disabled')).toBeUndefined()
    expect(gpkgButton?.attributes('disabled')).toBeDefined()

    await csvButton!.trigger('click')
    await flushPromises()

    expect(downloadThemeFile).toHaveBeenCalledWith({
      level2: 'DF',
      level3: null,
      theme: 'theme_alpha',
      format: 'csv',
    })
    expect(triggerBrowserDownload).toHaveBeenCalled()
  })
})
