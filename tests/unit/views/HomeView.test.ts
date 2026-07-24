import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SearchFilterComponent from '@/components/SearchFilterComponent.vue'
import {
  getDetailsByIdentifier,
  getTotalizers,
} from '@/services/totalizerService'

vi.mock('@/services/totalizerService', () => ({
  getTotalizers: vi.fn(),
  getDetailsByIdentifier: vi.fn(),
}))

vi.mock('@/services/configService', async () => {
  const { FALLBACK_INSTALLATION_CONFIG } = await import('@/config/installationConfigFallback')
  return {
    getInstallationConfig: vi.fn().mockResolvedValue(FALLBACK_INSTALLATION_CONFIG),
    peekInstallationConfig: vi.fn().mockReturnValue(FALLBACK_INSTALLATION_CONFIG),
  }
})

vi.mock('@/services/territoryService', () => ({
  getTerritoryOptions: vi.fn().mockResolvedValue([{ id: 'DF', name: 'DF - Distrito Federal' }]),
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
    vi.mocked(getTotalizers).mockResolvedValue([
      {
        name: 'Registered properties',
        code: 'AREA_OF_INTEREST',
        value: 100,
        unitOfMeasurement: 'un.',
      },
    ])
    vi.mocked(getDetailsByIdentifier).mockResolvedValue(null)
  })

  it('should render detail panel when identifier search succeeds', async () => {
    vi.mocked(getDetailsByIdentifier).mockResolvedValue({
      id: 'DF123456789012',
      registrationDate: '2020-01-10',
      territory: {
        level2: { id: 'DF', name: 'Distrito Federal' },
        level3: { id: '5300108', name: 'Brasília' },
      },
      latitude: '-15.793889',
      longitude: '-47.882778',
      area: 120.5,
      alterationDate: '2024-06-15',
    })

    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: HomeView },
        { path: '/geoservices', component: { template: '<div />' } },
        { path: '/about', component: { template: '<div />' } },
      ],
    })
    await router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    })
    await flushPromises()

    const searchFilter = wrapper.findComponent(SearchFilterComponent)
    await searchFilter.vm.$emit('search', {
      level1: '',
      level2: '',
      level3: '',
      identifier: 'DF123456789012',
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Search details')
    expect(wrapper.text()).toContain('DF123456789012')
    expect(wrapper.text()).toContain('Download features')
  })

  it('should render banner and load initial KPIs', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: HomeView },
        { path: '/geoservices', component: { template: '<div />' } },
        { path: '/about', component: { template: '<div />' } },
      ],
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
    expect(getTotalizers).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Registered properties')
  })
})
