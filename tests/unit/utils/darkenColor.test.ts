import { describe, expect, it } from 'vitest'
import { darkenHex } from '@/utils/darkenColor'

describe('darkenHex', () => {
  it('should darken a 6-digit hex color', () => {
    expect(darkenHex('#ffff00', 0.3)).toBe('#b3b300')
  })

  it('should expand 3-digit hex colors', () => {
    expect(darkenHex('#fc0', 0.5)).toBe('#806600')
  })

  it('should return original value when hex is invalid', () => {
    expect(darkenHex('not-a-color', 0.3)).toBe('not-a-color')
  })
})
