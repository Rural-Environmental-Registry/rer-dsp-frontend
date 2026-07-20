import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import MoreContents from '@/components/MoreContents.vue'
import { getMoreContentsCards, moreContentsUiConfig } from '@/config/moreContentsUi'

async function mountMoreContents() {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/geoservices', component: { template: '<div />' } },
      { path: '/about', component: { template: '<div />' } },
    ],
  })
  await router.push('/')
  await router.isReady()

  return mount(MoreContents, {
    props: {
      cards: getMoreContentsCards('home'),
    },
    global: {
      plugins: [router],
    },
  })
}

describe('MoreContents', () => {
  it('should render title, subtitle and page cards', async () => {
    const wrapper = await mountMoreContents()

    expect(wrapper.text()).toContain(moreContentsUiConfig.title)
    expect(wrapper.text()).toContain(moreContentsUiConfig.subtitle)
    expect(wrapper.text()).toContain('Downloads')
    expect(wrapper.text()).toContain('About')
    expect(wrapper.text()).toContain('Open source')
  })

  it('should open github link in a new tab', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const wrapper = await mountMoreContents()

    const githubTitle = wrapper
      .findAll('strong')
      .find((node) => node.text() === 'Open source')
    await githubTitle!.trigger('click')

    expect(openSpy).toHaveBeenCalledWith(
      moreContentsUiConfig.githubUrl,
      '_blank',
      'noopener,noreferrer',
    )
    openSpy.mockRestore()
  })
})
