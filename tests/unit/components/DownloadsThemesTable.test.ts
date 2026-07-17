import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DownloadsThemesTable from '@/components/DownloadsThemesTable.vue'
import type { DownloadItemDTO } from '@/types/download'

const items: DownloadItemDTO[] = [
  {
    themeCode: 'theme_alpha',
    themeName: 'Theme Alpha',
    formats: [
      { format: 'csv', status: 'available' },
      { format: 'gpkg', status: 'unavailable' },
    ],
    lastUpdate: '2026-06-01',
  },
]

describe('DownloadsThemesTable', () => {
  it('should render CP-like columns and link-style download actions', () => {
    const wrapper = mount(DownloadsThemesTable, {
      props: { items },
    })

    expect(wrapper.text()).toContain('Theme')
    expect(wrapper.text()).toContain('Services')
    expect(wrapper.text()).toContain('Last update')
    expect(wrapper.text()).toContain('Theme Alpha')
    expect(wrapper.text()).toContain('06/01/2026')

    const csvButton = wrapper.findAll('button.download-theme').find((button) =>
      button.text().includes('CSV'),
    )
    const gpkgButton = wrapper.findAll('button.download-theme').find((button) =>
      button.text().includes('GPKG'),
    )

    expect(csvButton?.classes()).toContain('download-theme')
    expect(csvButton?.attributes('disabled')).toBeUndefined()
    expect(gpkgButton?.attributes('disabled')).toBeDefined()
    expect(wrapper.find('.btn-geosservices-table').exists()).toBe(true)
  })

  it('should emit download for available format', async () => {
    const wrapper = mount(DownloadsThemesTable, {
      props: { items },
    })

    const csvButton = wrapper.findAll('button.download-theme').find((button) =>
      button.text().includes('CSV'),
    )
    await csvButton!.trigger('click')

    expect(wrapper.emitted('download')?.[0]).toEqual([items[0], 'csv'])
  })
})
