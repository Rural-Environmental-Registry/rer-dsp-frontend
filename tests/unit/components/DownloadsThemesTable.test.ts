import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DownloadsThemesTable from '@/components/DownloadsThemesTable.vue'
import type { DownloadItemDTO } from '@/types/download'

const items: DownloadItemDTO[] = [
  {
    themeCode: 'theme_alpha',
    themeName: 'Theme Alpha',
    formats: [{ format: 'csv', status: 'available' }],
    lastUpdate: '2026-06-01',
  },
]

describe('DownloadsThemesTable', () => {
  it('should render CP-like columns and CSV download action without GPKG', () => {
    const wrapper = mount(DownloadsThemesTable, {
      props: { items },
    })

    expect(wrapper.text()).toContain('Theme')
    expect(wrapper.text()).toContain('Services')
    expect(wrapper.text()).toContain('Last update')
    expect(wrapper.text()).toContain('Theme Alpha')
    expect(wrapper.text()).toContain('01/06/2026')
    expect(wrapper.text()).toContain('CSV')
    expect(wrapper.text()).not.toContain('GPKG')

    const csvButton = wrapper.findAll('button.download-theme').find((button) =>
      button.text().includes('CSV'),
    )

    expect(csvButton?.classes()).toContain('download-theme')
    expect(csvButton?.attributes('disabled')).toBeUndefined()
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
