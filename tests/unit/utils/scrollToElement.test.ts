import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SCROLL_OFFSET_RATIO, scrollToElement } from '@/utils/scrollToElement'

describe('scrollToElement', () => {
  const scrollTo = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('scrollTo', scrollTo)
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
    })
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 200,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('should not call window.scrollTo when target is missing', () => {
    scrollToElement('.missing-target')
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('should scroll with 10% viewport offset above the target', () => {
    const target = document.createElement('div')
    target.className = 'target'
    document.body.appendChild(target)
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 400,
      bottom: 500,
      left: 0,
      right: 0,
      width: 0,
      height: 100,
      x: 0,
      y: 400,
      toJSON: () => ({}),
    })

    scrollToElement('.target')

    expect(scrollTo).toHaveBeenCalledWith({
      top: 400 + 200 - 1000 * SCROLL_OFFSET_RATIO,
      behavior: 'smooth',
    })
  })

  it('should clamp scroll top to 0 when target is near the page top', () => {
    const target = document.createElement('div')
    target.className = 'near-top'
    document.body.appendChild(target)
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 0,
    })
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 20,
      bottom: 120,
      left: 0,
      right: 0,
      width: 0,
      height: 100,
      x: 0,
      y: 20,
      toJSON: () => ({}),
    })

    scrollToElement('.near-top')

    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
  })
})
