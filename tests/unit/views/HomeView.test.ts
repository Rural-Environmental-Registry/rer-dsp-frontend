import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SearchFilterComponent from '@/components/SearchFilterComponent.vue'
import {
  getDetailsByIdentifier,
  getTotalizersByStateOrCity,
} from '@/services/totalizerService'

vi.mock('@/services/totalizerService', () => ({
  getTotalizersByStateOrCity: vi.fn(),
  getDetailsByIdentifier: vi.fn(),
}))

vi.mock('@/services/configService', async () => {
  const { FALLBACK_INSTALLATION_CONFIG } = await import('@/config/installationConfigFallback')
  return {
    getInstallationConfig: vi.fn().mockResolvedValue(FALLBACK_INSTALLATION_CONFIG),
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
    vi.mocked(getTotalizersByStateOrCity).mockResolvedValue([
      {
        name: 'Registered properties',
        code: 'REGISTERED_AREA',
        value: 100,
        unitOfMeasurement: 'un.',
      },
    ])
    vi.mocked(getDetailsByIdentifier).mockResolvedValue(null)
  })

  it('should render detail panel when identifier search succeeds', async () => {
    vi.mocked(getDetailsByIdentifier).mockResolvedValue({
      codeProperty: 'DF123456789012',
      createdAt: '10/01/2020',
      nameCity: 'Brasília',
      nameState: 'Distrito Federal',
      latitude: '-15.793889',
      longitude: '-47.882778',
      geographicCoordinatesOfCentroid: '-15.793889, -47.882778',
      haRegisteredArea: 120.5,
      fiscalModules: 2.5,
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
    expect(getTotalizersByStateOrCity).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Registered properties')
  })
})
