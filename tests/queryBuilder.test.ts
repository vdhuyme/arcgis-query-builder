import Query from '@arcgis/core/rest/support/Query.js'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import { QueryBuilder } from '../src/query/QueryBuilder'

jest.mock('@arcgis/core/rest/support/Query.js', () => ({
  __esModule: true,
  default: class QueryMock {
    [key: string]: any
    constructor(init: any = {}) {
      Object.assign(this, init)
    }
    clone() {
      return { ...this } as any
    }
  }
}))

jest.mock('@arcgis/core/layers/FeatureLayer.js', () => {
  return jest.fn().mockImplementation(() => ({
    queryFeatures: jest.fn().mockResolvedValue({ features: [{ id: 1 }, { id: 2 }] })
  }))
})

describe('QueryBuilder', () => {
  it('select, order, limit, offset, paginate, distinct, groupBy', () => {
    const qb = new QueryBuilder()
      .select(['a', 'b'])
      .orderBy('a', 'DESC')
      .thenOrderBy('b')
      .limit(10)
      .offset(5)
      .paginate(2, 15)
      .distinct()
      .groupBy(['a', 'b'])
    const q = (qb as any).query as Query
    expect(q.outFields).toEqual(['a', 'b'])
    expect(q.orderByFields).toEqual(['a DESC', 'b ASC'])
    expect(q.num).toBe(15)
    expect(q.start).toBe(15)
    expect(q.returnDistinctValues).toBe(true)
    expect(q.groupByFieldsForStatistics).toEqual(['a', 'b'])
  })

  it('where and orWhere with sub-clause', () => {
    const qb = new QueryBuilder()
    qb.where('A = 1').orWhere(sub => {
      sub.where('B', '>', 5).where('C', '=', 'x')
    })
    expect(qb.getWhereClause()).toContain('A = 1 OR (')
    expect(qb.getWhereClause()).toContain("B > 5 AND C = 'x'")
  })

  it('date/time helper methods', () => {
    const qb = new QueryBuilder()
    qb.whereDate('created', '>=', new Date('2024-01-01'))
      .whereYear('created', '=', 2024)
      .whereMonth('created', 'IN', [1, 2])
      .whereDay('created', '=', 10)
      .whereDayOfWeek('created', 'NOT IN', [1, 7])
      .whereTime('created', '>', '09:30:00')
      .whereBusinessHours('created')
      .whereWeekdays('created')
      .whereWeekends('created')

    const clause = qb.getWhereClause()
    expect(clause).toContain("DATE '2024-01-01'")
    expect(clause).toContain('EXTRACT(YEAR FROM created) = 2024')
    expect(clause).toContain('EXTRACT(MONTH FROM created) IN (1, 2)')
    expect(clause).toContain('EXTRACT(DAY FROM created) = 10')
    expect(clause).toContain('EXTRACT(DOW FROM created) NOT IN (1, 7)')
    expect(clause).toContain('EXTRACT(HOUR FROM created)')
  })

  it('stats and addStat', () => {
    const qb = new QueryBuilder()
    qb.stats({
      onStatisticField: 'pop',
      outStatisticFieldName: 'sum_pop',
      statisticType: 'sum'
    }).addStat('age', 'avg', 'avg_age')
    const q = (qb as any).query as Query
    expect(q.outStatistics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ outStatisticFieldName: 'sum_pop' }),
        expect.objectContaining({ outStatisticFieldName: 'avg_age' })
      ])
    )
  })

  it('exec, first, count, exists', async () => {
    const layer = new (FeatureLayer as any)()
    const qb = QueryBuilder.from(layer)
    const res = await qb.exec()
    expect(res.features.length).toBe(2)

    const first = await qb.first()
    expect(first).toEqual({ id: 1 })

    const count = await qb.count()
    expect(count).toBe(2)

    const exists = await qb.exists()
    expect(exists).toBe(true)
  })

  it('clearWhere and whereRaw', () => {
    const qb = new QueryBuilder()
    qb.where('A=1')
    expect(qb.getWhereClause()).toContain('A=1')
    qb.clearWhere()
    expect(qb.getWhereClause()).toBe('1=1')
    qb.whereRaw('B=2')
    expect(qb.getWhereClause()).toBe('B=2')
  })

  it('executes callback when test is true', () => {
    const qb = new QueryBuilder()
    qb.when(true, q => q.where('A=1'))
    expect(qb.getWhereClause()).toContain('A=1')
  })

  it('executes elseCallback when test is false', () => {
    const qb = new QueryBuilder()
    qb.when(
      false,
      q => q.where('B=1'),
      q => q.where('C=1')
    )
    expect(qb.getWhereClause()).toContain('C=1')
  })

  it('evaluates function as condition', () => {
    const qb = new QueryBuilder()
    qb.when(
      () => 1 + 1 === 2,
      q => q.where('D=1')
    )
    expect(qb.getWhereClause()).toContain('D=1')
  })

  it('can chain multiple when calls', () => {
    const qb = new QueryBuilder()
    qb.when(true, q => q.where('E=1')).when(
      false,
      q => q.where('F=1'),
      q => q.where('G=1')
    )
    const clause = qb.getWhereClause()
    expect(clause).toContain('E=1')
    expect(clause).toContain('G=1')
  })

  it('executes exec, first, count, exists after when', async () => {
    const layer = new (FeatureLayer as any)()
    const qb = QueryBuilder.from(layer)

    qb.when(true, q => q.where('H=1'))

    const res = await qb.exec()
    expect(res.features.length).toBe(2)

    const first = await qb.first()
    expect(first).toEqual({ id: 1 })

    const count = await qb.count()
    expect(count).toBe(2)

    const exists = await qb.exists()
    expect(exists).toBe(true)
  })
})
