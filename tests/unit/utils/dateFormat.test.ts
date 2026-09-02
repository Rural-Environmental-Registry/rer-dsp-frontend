import { describe, expect, it } from 'vitest'
import { formatDate, formatDateTime } from '@/utils/dateFormat'

describe('dateFormat', () => {
  it('formatDate should apply display pattern to yyyy-MM-dd', () => {
    expect(formatDate('2020-01-10', 'dd/MM/yyyy')).toBe('10/01/2020')
    expect(formatDate('2026-06-01', 'MM/dd/yyyy')).toBe('06/01/2026')
  })

  it('formatDate should keep transfer value when pattern is missing', () => {
    expect(formatDate('2020-01-10', null)).toBe('2020-01-10')
    expect(formatDate('2020-01-10', undefined)).toBe('2020-01-10')
    expect(formatDate('2020-01-10', '')).toBe('2020-01-10')
  })

  it('formatDate should return original when input is not yyyy-MM-dd', () => {
    expect(formatDate('10/01/2020', 'dd/MM/yyyy')).toBe('10/01/2020')
    expect(formatDate('', 'dd/MM/yyyy')).toBe('')
    expect(formatDate(null, 'dd/MM/yyyy')).toBe('')
  })

  it('formatDateTime should apply display pattern', () => {
    expect(formatDateTime('2024-06-15T14:30:00', 'dd/MM/yyyy HH:mm:ss')).toBe(
      '15/06/2024 14:30:00',
    )
  })

  it('formatDateTime should keep transfer value when pattern is missing', () => {
    expect(formatDateTime('2024-06-15T14:30:00', null)).toBe('2024-06-15T14:30:00')
  })
})
