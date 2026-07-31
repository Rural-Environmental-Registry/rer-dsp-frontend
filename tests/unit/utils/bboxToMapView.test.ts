import { describe, expect, it } from 'vitest'
import { bboxToMapView } from '@/utils/bboxToMapView'

describe('bboxToMapView', () => {
  it('should return the geographic center of the bbox', () => {
    const view = bboxToMapView({
      minX: -74,
      minY: -34,
      maxX: -34,
      maxY: 6,
    })

    expect(view.center[0]).toBeCloseTo(-14, 5)
    expect(view.center[1]).toBeCloseTo(-54, 5)
  })

  it('should return a lower zoom for a wider bbox', () => {
    const wide = bboxToMapView({
      minX: -74,
      minY: -34,
      maxX: -34,
      maxY: 6,
    })
    const narrow = bboxToMapView({
      minX: -48.2,
      minY: -16,
      maxX: -47.3,
      maxY: -15.5,
    })

    expect(wide.zoom).toBeLessThan(narrow.zoom)
    expect(wide.zoom).toBeGreaterThanOrEqual(0)
    expect(narrow.zoom).toBeLessThanOrEqual(16)
  })
})
