import { WhereBuilder } from '../src/query/WhereBuilder'

describe('WhereBuilder', () => {
  it('builds empty as 1=1', () => {
    const wb = new WhereBuilder()
    expect(wb.build()).toBe('1=1')
  })

  it('pushes raw and combines with AND by default', () => {
    const wb = new WhereBuilder()
    wb.pushRaw('A=1').and().pushRaw('B=2')
    expect(wb.build()).toBe('A=1 AND B=2')
  })

  it('supports OR operator', () => {
    const wb = new WhereBuilder()
    wb.pushRaw('A=1').or().pushRaw('B=2')
    expect(wb.build()).toBe('A=1 OR B=2')
  })

  it('where(condition) handles null and not null', () => {
    const wb = new WhereBuilder()
    wb.where('A', '=', null as any)
      .and()
      .where('B', '!=', null as any)
    expect(wb.build()).toBe('A IS NULL AND B IS NOT NULL')
  })

  it('whereBetween and whereNotBetween', () => {
    const wb = new WhereBuilder()
    wb.whereBetween('age', 18, 30).and().whereNotBetween('score', 50, 60)
    expect(wb.build()).toBe('age BETWEEN 18 AND 30 AND score NOT BETWEEN 50 AND 60')
  })

  it('whereIn and whereNotIn', () => {
    const wb = new WhereBuilder()
    wb.whereIn('id', [1, 2]).and().whereNotIn('id', [3, 4])
    expect(wb.build()).toBe('id IN (1, 2) AND id NOT IN (3, 4)')
  })

  it('null/not null helpers', () => {
    const wb = new WhereBuilder()
    wb.whereNull('name').and().whereNotNull('email')
    expect(wb.build()).toBe('name IS NULL AND email IS NOT NULL')
  })

  it('like/not like', () => {
    const wb = new WhereBuilder()
    wb.whereLike('name', '%john%').and().whereNotLike('name', '%doe%')
    expect(wb.build()).toBe("name LIKE '%john%' AND name NOT LIKE '%doe%'")
  })

  it('date/year/month/day/dayOfWeek/time', () => {
    const wb = new WhereBuilder()
    wb.whereDate('created', '>=', new Date('2024-01-01'))
      .and()
      .whereYear('created', '=', 2024)
      .and()
      .whereMonth('created', 'IN', [1, 2])
      .and()
      .whereDay('created', '=', 10)
      .and()
      .whereDayOfWeek('created', 'NOT IN', [1, 7])
      .and()
      .whereTime('created', '>', '09:30:00')

    expect(wb.build()).toContain("DATE '2024-01-01'")
    expect(wb.build()).toContain('EXTRACT(YEAR FROM created) = 2024')
    expect(wb.build()).toContain('EXTRACT(MONTH FROM created) IN (1, 2)')
    expect(wb.build()).toContain('EXTRACT(DAY FROM created) = 10')
    expect(wb.build()).toContain('EXTRACT(DOW FROM created) NOT IN (1, 7)')
    expect(wb.build()).toContain(
      'EXTRACT(HOUR FROM created) * 3600 + EXTRACT(MINUTE FROM created) * 60 + EXTRACT(SECOND FROM created) > 34200'
    )
  })

  it('clear resets state', () => {
    const wb = new WhereBuilder()
    wb.pushRaw('A=1').clear()
    expect(wb.build()).toBe('1=1')
  })
})
