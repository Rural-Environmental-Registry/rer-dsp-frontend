import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SearchFilterComponent from '@/components/SearchFilterComponent.vue'
import { getTerritoryOptions } from '@/services/territoryService'

vi.mock('@/services/territoryService', () => ({
  getTerritoryOptions: vi.fn(),
}))

vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    name: 'FontAwesomeIcon',
    template: '<i />',
  },
}))

describe('SearchFilterComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getTerritoryOptions).mockImplementation(async (level, parentId) => {
      if (level === 'level2' && !parentId) {
        return [
          { id: 'DF', name: 'DF - Distrito Federal' },
          { id: 'GO', name: 'GO - Goiás' },
        ]
      }
      if (level === 'level3' && parentId === 'DF') {
        return [{ id: '5300108', name: 'Brasília' }]
      }
      return []
    })
  })

  it('should load root level options on mount', async () => {
    const wrapper = mount(SearchFilterComponent)
    await flushPromises()

    expect(getTerritoryOptions).toHaveBeenCalledWith('level2')
    expect(wrapper.text()).toContain('Browse registered data')
  })

  it('should emit search with selected filters', async () => {
    const wrapper = mount(SearchFilterComponent)
    await flushPromises()

    const selects = wrapper.findAll('select')
    await selects[0].setValue('DF')
    await flushPromises()

    expect(getTerritoryOptions).toHaveBeenCalledWith('level3', 'DF')

    const buttons = wrapper.findAll('button')
    const searchButton = buttons.find((button) => button.text().includes('Search'))
    await searchButton!.trigger('click')

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')?.[0]?.[0]).toMatchObject({
      level2: 'DF',
      identifier: '',
      theme: '',
    })
  })

  it('should emit clear and reset form', async () => {
    const wrapper = mount(SearchFilterComponent)
    await flushPromises()

    const selects = wrapper.findAll('select')
    await selects[0].setValue('DF')
    await flushPromises()

    const clearButton = wrapper.findAll('button').find((button) => button.text().includes('Clear'))
    await clearButton!.trigger('click')

    expect(wrapper.emitted('clear')).toBeTruthy()
  })
})
