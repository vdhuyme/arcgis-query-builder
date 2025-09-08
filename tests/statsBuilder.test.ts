import { StatsBuilder } from '../src/query/StatsBuilder'

describe('StatsBuilder', () => {
  it('adds and builds stats', () => {
    const b = new StatsBuilder()
      .add({
        onStatisticField: 'pop',
        outStatisticFieldName: 'sum_pop',
        statisticType: 'sum'
      })
      .addSimple('age', 'avg', 'avg_age')

    const result = b.build()
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ outStatisticFieldName: 'sum_pop' }),
        expect.objectContaining({ outStatisticFieldName: 'avg_age' })
      ])
    )
  })

  it('merge validates input', () => {
    const b = new StatsBuilder()
    b.merge({
      onStatisticField: 'salary',
      outStatisticFieldName: 'max_salary',
      statisticType: 'max'
    })
    expect(b.build()[0].outStatisticFieldName).toBe('max_salary')
  })
})
