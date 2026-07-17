import { describe, expect, it } from 'vitest'
import { aboutUiConfig, getAboutTabById, isAboutTabId } from '@/config/aboutUi'

describe('aboutUi config', () => {
  it('should expose four tabs without roadmap', () => {
    const ids = aboutUiConfig.tabs.map((tab) => tab.id)

    expect(ids).toEqual(['overview', 'how-to-use', 'configuration', 'license'])
    expect(ids).not.toContain('roadmap')
  })

  it('should resolve default tab for invalid ids', () => {
    expect(getAboutTabById('invalid').id).toBe(aboutUiConfig.defaultTabId)
    expect(getAboutTabById(null).id).toBe('overview')
  })

  it('should validate tab ids', () => {
    expect(isAboutTabId('overview')).toBe(true)
    expect(isAboutTabId('roadmap')).toBe(false)
  })
})
