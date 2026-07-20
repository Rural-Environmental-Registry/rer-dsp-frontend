import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '@/views/AboutView.vue'
import { aboutUiConfig } from '@/config/aboutUi'

async function mountAbout(query: Record<string, string> = {}) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/geoservices', component: { template: '<div />' } },
      { path: '/about', name: 'about', component: AboutView },
    ],
  })
  await router.push({ path: '/about', query })
  await router.isReady()

  const wrapper = mount(AboutView, {
    global: {
      plugins: [router],
    },
  })
  await flushPromises()
  return { wrapper, router }
}

describe('AboutView', () => {
  it('should render banner and overview tab by default', async () => {
    const { wrapper } = await mountAbout()

    expect(wrapper.text()).toContain(aboutUiConfig.bannerTitle)
    expect(wrapper.text()).toContain('Overview')
    expect(wrapper.text()).toContain('How to use')
    expect(wrapper.text()).toContain('Configuration')
    expect(wrapper.text()).toContain('License')
    expect(wrapper.text()).not.toContain('Roadmap')
    expect(wrapper.text()).toContain('Digital Public Good')
  })

  it('should switch tab content and update query', async () => {
    const { wrapper, router } = await mountAbout()

    const licenseTab = wrapper
      .findAll('button[role="tab"]')
      .find((button) => button.text() === 'License')
    await licenseTab!.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.query.tab).toBe('license')
    expect(wrapper.text()).toContain('GPL-3.0')
    expect(wrapper.text()).toContain('LICENSE')
  })

  it('should open how-to-use from query string', async () => {
    const { wrapper } = await mountAbout({ tab: 'how-to-use' })

    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Downloads')
    expect(wrapper.text()).toContain('Level 2')
  })
})
