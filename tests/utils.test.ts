import { formatValue, formatDateValue, timeToSeconds } from '../src/utils'

describe('utils', () => {
  describe('formatValue', () => {
    it('formats string with quotes', () => {
      expect(formatValue('abc')).toBe("'abc'")
    })
    it("formats date as DATE 'YYYY-MM-DD'", () => {
      const d = new Date('2024-01-15T12:34:56Z')
      expect(formatValue(d)).toBe("DATE '2024-01-15'")
    })
    it('formats null/undefined as NULL', () => {
      expect(formatValue(null as any)).toBe('NULL')
      expect(formatValue(undefined as any)).toBe('NULL')
    })
    it('formats boolean as 1/0', () => {
      expect(formatValue(true)).toBe('1')
      expect(formatValue(false)).toBe('0')
    })
    it('formats number as-is', () => {
      expect(formatValue(123)).toBe('123')
    })
  })

  describe('formatDateValue', () => {
    it('throws for invalid date', () => {
      expect(() => formatDateValue('invalid' as any)).toThrow()
    })
    it('formats date type', () => {
      const d = new Date('2024-03-01T00:00:00Z')
      expect(formatDateValue(d, 'date')).toBe("DATE '2024-03-01'")
    })
    it('formats datetime type', () => {
      const d = new Date('2024-03-01T01:02:03Z')
      expect(formatDateValue(d, 'datetime')).toBe("TIMESTAMP '2024-03-01 01:02:03.000'")
    })
    it('formats timestamp (ms since epoch)', () => {
      const d = new Date('2024-03-01T00:00:00Z')
      expect(formatDateValue(d, 'timestamp')).toBe(`${d.getTime()}`)
    })
  })

  describe('timeToSeconds', () => {
    it('parses HH:MM:SS', () => {
      expect(timeToSeconds('01:02:03')).toBe(3723)
    })
    it('parses HH:MM', () => {
      expect(timeToSeconds('02:30')).toBe(150 * 60)
      expect(timeToSeconds('02:30')).toBe(2 * 3600 + 30 * 60)
    })
    it('parses HH only', () => {
      expect(timeToSeconds('10')).toBe(36000)
    })
  })
})
