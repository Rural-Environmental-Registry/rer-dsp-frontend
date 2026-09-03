import { describe, expect, it } from 'vitest'
import { getMoreContentsCards, moreContentsUiConfig } from '@/config/moreContentsUi'

describe('moreContentsUi config', () => {
  it('should expose home cards for downloads, about and github', () => {
    const cards = getMoreContentsCards('home')
    const targets = cards.map((card) => card.routerTo ?? card.externalLink)

    expect(targets).toEqual([
      '/geoservices',
      '/about',
      moreContentsUiConfig.githubUrl,
    ])
  })

  it('should expose geoservices cards for home, about and github', () => {
    const cards = getMoreContentsCards('geoservices')
    const targets = cards.map((card) => card.routerTo ?? card.externalLink)

    expect(targets).toEqual(['/', '/about', moreContentsUiConfig.githubUrl])
  })

  it('should expose about cards for home, downloads and github', () => {
    const cards = getMoreContentsCards('about')
    const targets = cards.map((card) => card.routerTo ?? card.externalLink)

    expect(targets).toEqual(['/', '/geoservices', moreContentsUiConfig.githubUrl])
  })
})
