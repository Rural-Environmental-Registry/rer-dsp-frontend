import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import {
  getDetailsByIdentifier,
  getTotalizersByStateOrCity,
} from '@/services/totalizerService'

vi.mock('@/services/totalizerService', () => ({
  getTotalizersByStateOrCity: vi.fn(),
  getDetailsByIdentifier: vi.fn(),
}))

vi.mock('@/services/locationService', () => ({
  getStates: vi.fn().mockResolvedValue([{ id: 'DF', name: 'Distrito Federal' }]),
  getCitiesByState: vi.fn().mockResolvedValue([]),
  getRegionsWithStates: vi.fn().mockResolvedValue([]),
  getStatesByRegion: vi.fn().mockResolvedValue([]),
}))

vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    name: 'FontAwesomeIcon',
    template: '<i />',
  },
}))

describe('HomeView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getTotalizersByStateOrCity).mockResolvedValue([
      {
        name: 'Imóveis cadastrados',
        code: 'REGISTERED_AREA',
        value: 100,
        unitOfMeasurement: 'un.',
      },
    ])
    vi.mocked(getDetailsByIdentifier).mockResolvedValue(null)
  })

  it('should render banner and load initial KPIs', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: HomeView }],
    })
    await router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Data Sharing Platform')
    expect(getTotalizersByStateOrCity).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Imóveis cadastrados')
  })
})
