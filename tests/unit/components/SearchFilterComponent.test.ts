import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SearchFilterComponent from '@/components/SearchFilterComponent.vue'
import { getCitiesByState, getStates } from '@/services/locationService'

vi.mock('@/services/locationService', () => ({
  getStates: vi.fn(),
  getCitiesByState: vi.fn(),
  getRegionsWithStates: vi.fn(),
  getStatesByRegion: vi.fn(),
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
    vi.mocked(getStates).mockResolvedValue([
      { id: 'DF', name: 'Distrito Federal' },
      { id: 'GO', name: 'Goiás' },
    ])
    vi.mocked(getCitiesByState).mockResolvedValue([
      { id: 5300108, name: 'Brasília' },
    ])
  })

  it('should load level 2 options on mount', async () => {
    const wrapper = mount(SearchFilterComponent)
    await flushPromises()

    expect(getStates).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('Consulte os dados cadastrados')
  })

  it('should emit search with selected filters', async () => {
    const wrapper = mount(SearchFilterComponent)
    await flushPromises()

    const selects = wrapper.findAll('select')
    await selects[0].setValue('DF')
    await flushPromises()

    expect(getCitiesByState).toHaveBeenCalledWith('DF')

    const buttons = wrapper.findAll('button')
    const searchButton = buttons.find((button) => button.text().includes('Buscar'))
    await searchButton!.trigger('click')

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')?.[0]?.[0]).toMatchObject({
      level2: 'DF',
      identifier: '',
    })
  })

  it('should emit clear and reset form', async () => {
    const wrapper = mount(SearchFilterComponent)
    await flushPromises()

    const selects = wrapper.findAll('select')
    await selects[0].setValue('DF')
    await flushPromises()

    const clearButton = wrapper.findAll('button').find((button) => button.text().includes('Limpar'))
    await clearButton!.trigger('click')

    expect(wrapper.emitted('clear')).toBeTruthy()
  })
})
