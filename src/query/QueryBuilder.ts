import Query from '@arcgis/core/rest/support/Query.js'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import {
  ComparisonOperator,
  LogicalOperator,
  SortOrder,
  QueryStatisticDefinitionInput,
  StatisticType,
  SpatialRelationship,
  OutField,
  OrderByField,
  GroupByField,
  ObjectIds,
  ParameterValues,
  QuantizationParametersType,
  RangeValues,
  DatumTransformation,
  CacheHint,
  Distance,
  GdbVersion,
  GeometryPrecision,
  HavingExpression,
  HistoricMoment,
  MaxAllowableOffset,
  MaxRecordCountFactor,
  MultipatchOption,
  PixelSizeType,
  RelationParameter,
  ReturnCentroid,
  ReturnExceededLimitFeatures,
  ReturnM,
  ReturnQueryGeometry,
  ReturnZ,
  SqlFormat,
  TextSearch,
  Units
} from '../types'
import { WhereBuilder } from './WhereBuilder'
import { StatsBuilder } from './StatsBuilder'
import { QueryProps } from './QueryProps'

export class QueryBuilder {
  private layer: FeatureLayer | null = null
  private query: Query = new Query({
    where: '1=1',
    outFields: ['*'],
    returnGeometry: false
  })
  private _where = new WhereBuilder()
  private _currentOp: LogicalOperator = 'AND'

  static from(layer: FeatureLayer) {
    const qb = new QueryBuilder()
    qb.layer = layer
    return qb
  }

  static fromSource(source: FeatureLayer | string) {
    if (typeof source === 'string') {
      const lyr = new FeatureLayer({ url: source })
      return QueryBuilder.from(lyr)
    }
    return QueryBuilder.from(source)
  }

  where(
    column: string | ((qb: QueryBuilder) => void),
    operator?: ComparisonOperator,
    value?: string | number | Date | boolean | null | undefined
  ) {
    if (typeof column === 'function') {
      const sub = new QueryBuilder()
      sub.layer = this.layer
      column(sub)
      const subClause = sub._buildWhereClause()
      if (subClause && subClause !== '1=1') this._pushClause(`(${subClause})`)
    } else if (arguments.length === 1) {
      this._pushClause(column as string)
    } else {
      this._where.and().where(column as string, operator as ComparisonOperator, value)
    }
    this._updateWhereClause()
    return this
  }

  orWhere(
    column: string | ((qb: QueryBuilder) => void),
    operator?: ComparisonOperator,
    value?: string | number | Date | boolean | null | undefined
  ) {
    const prev = this._currentOp
    this._currentOp = 'OR'
    if (typeof column === 'function') {
      const sub = new QueryBuilder()
      sub.layer = this.layer
      column(sub)
      const subClause = sub._buildWhereClause()
      if (subClause && subClause !== '1=1') {
        this._pushClause(`(${subClause})`)
      }
      this._updateWhereClause()
      this._currentOp = prev
      return this
    }
    const res = this.where(column as string, operator as ComparisonOperator, value)
    this._currentOp = prev
    return res
  }

  private _updateWhereClause() {
    this.query.where = this._where.build()
  }

  private _pushClause(clause: string) {
    this._currentOp === 'OR' ? this._where.or().pushRaw(clause) : this._where.and().pushRaw(clause)
  }

  select(fields: OutField[] | OutField) {
    if (typeof fields === 'string') fields = [fields]
    this.query.outFields = fields as string[]
    return this
  }

  orderBy(field: OrderByField, order: SortOrder = 'ASC') {
    this.query.orderByFields = [`${field} ${order}`]
    return this
  }

  thenOrderBy(field: OrderByField, order: SortOrder = 'ASC') {
    if (!this.query.orderByFields) this.query.orderByFields = []
    this.query.orderByFields.push(`${field} ${order}`)
    return this
  }

  limit(n: number) {
    this.query.num = n
    return this
  }

  offset(start: number) {
    this.query.start = start
    return this
  }

  paginate(page: number, perPage: number) {
    this.limit(perPage)
    this.offset((page - 1) * perPage)
    return this
  }

  distinct() {
    this.query.returnDistinctValues = true
    return this
  }

  groupBy(fields: GroupByField | GroupByField[]) {
    if (typeof fields === 'string') fields = [fields]
    this.query.groupByFieldsForStatistics = fields as string[]
    return this
  }

  stats(statistics: QueryStatisticDefinitionInput | QueryStatisticDefinitionInput[]) {
    const builder = new StatsBuilder().merge(statistics)
    this.query.outStatistics = builder.build()
    return this
  }

  addStat(field: string, type: StatisticType, alias?: string) {
    const existing = (this.query.outStatistics || []) as QueryStatisticDefinitionInput[]
    const builder = new StatsBuilder().merge(existing)
    builder.addSimple(field, type, alias)
    this.query.outStatistics = builder.build()
    return this
  }

  whereBetween(column: string, min: string | number | Date, max: string | number | Date) {
    this._where.and().whereBetween(column, min, max)
    this._updateWhereClause()
    return this
  }

  whereNotBetween(column: string, min: string | number | Date, max: string | number | Date) {
    this._where.and().whereNotBetween(column, min, max)
    this._updateWhereClause()
    return this
  }

  whereIn(column: string, values: Array<string | number>) {
    if (!Array.isArray(values) || values.length === 0)
      throw new Error('whereIn requires a non-empty array of values')
    this._where.and().whereIn(column, values)
    this._updateWhereClause()
    return this
  }

  whereNotIn(column: string, values: Array<string | number>) {
    if (!Array.isArray(values) || values.length === 0)
      throw new Error('whereNotIn requires a non-empty array of values')
    this._where.and().whereNotIn(column, values)
    this._updateWhereClause()
    return this
  }

  whereNull(column: string) {
    this._where.and().whereNull(column)
    this._updateWhereClause()
    return this
  }

  whereNotNull(column: string) {
    this._where.and().whereNotNull(column)
    this._updateWhereClause()
    return this
  }

  whereLike(column: string, pattern: string) {
    this._where.and().whereLike(column, pattern)
    this._updateWhereClause()
    return this
  }

  whereNotLike(column: string, pattern: string) {
    this._where.and().whereNotLike(column, pattern)
    this._updateWhereClause()
    return this
  }

  when(
    test: boolean | (() => boolean),
    callback: (qb: QueryBuilder) => void,
    elseCallback?: (qb: QueryBuilder) => void
  ) {
    const condition = typeof test === 'function' ? test() : test
    if (condition) {
      callback(this)
    } else if (elseCallback) {
      elseCallback(this)
    }
    return this
  }

  geometry(geometry: __esri.Geometry) {
    this.query.geometry = geometry
    return this
  }

  spatialRelationship(relationship: SpatialRelationship) {
    this.query.spatialRelationship = relationship
    return this
  }

  withGeometry(flag: boolean = false) {
    this.query.returnGeometry = flag
    return this
  }

  cacheHint(flag: CacheHint) {
    new QueryProps(this.query).cacheHint(flag)
    return this
  }
  datumTransformation(t: DatumTransformation) {
    new QueryProps(this.query).datumTransformation(t)
    return this
  }
  distance(value: Distance) {
    new QueryProps(this.query).distance(value)
    return this
  }
  gdbVersion(version: GdbVersion) {
    new QueryProps(this.query).gdbVersion(version)
    return this
  }
  geometryPrecision(precision: GeometryPrecision) {
    new QueryProps(this.query).geometryPrecision(precision)
    return this
  }
  having(expr: HavingExpression) {
    new QueryProps(this.query).having(expr)
    return this
  }
  historicMoment(date: HistoricMoment) {
    new QueryProps(this.query).historicMoment(date)
    return this
  }
  maxAllowableOffset(offset: MaxAllowableOffset) {
    new QueryProps(this.query).maxAllowableOffset(offset)
    return this
  }
  maxRecordCountFactor(factor: MaxRecordCountFactor) {
    new QueryProps(this.query).maxRecordCountFactor(factor)
    return this
  }
  multipatchOption(option: MultipatchOption) {
    new QueryProps(this.query).multipatchOption(option)
    return this
  }
  objectIds(ids: ObjectIds) {
    new QueryProps(this.query).objectIds(ids)
    return this
  }
  outSpatialReference(sr: __esri.SpatialReference) {
    new QueryProps(this.query).outSpatialReference(sr)
    return this
  }
  parameterValues(values: ParameterValues) {
    new QueryProps(this.query).parameterValues(values)
    return this
  }
  pixelSize(p: PixelSizeType) {
    new QueryProps(this.query).pixelSize(p)
    return this
  }
  quantizationParameters(q: QuantizationParametersType) {
    new QueryProps(this.query).quantizationParameters(q)
    return this
  }
  rangeValues(values: RangeValues) {
    new QueryProps(this.query).rangeValues(values)
    return this
  }
  relationParameter(param: RelationParameter) {
    new QueryProps(this.query).relationParameter(param)
    return this
  }
  returnCentroid(flag: ReturnCentroid) {
    new QueryProps(this.query).returnCentroid(flag)
    return this
  }
  returnExceededLimitFeatures(flag: ReturnExceededLimitFeatures) {
    new QueryProps(this.query).returnExceededLimitFeatures(flag)
    return this
  }
  returnM(flag: ReturnM) {
    new QueryProps(this.query).returnM(flag)
    return this
  }
  returnQueryGeometry(flag: ReturnQueryGeometry) {
    new QueryProps(this.query).returnQueryGeometry(flag)
    return this
  }
  returnZ(flag: ReturnZ) {
    new QueryProps(this.query).returnZ(flag)
    return this
  }
  sqlFormat(fmt: SqlFormat) {
    new QueryProps(this.query).sqlFormat(fmt)
    return this
  }
  textLike(text: TextSearch) {
    new QueryProps(this.query).textLike(text)
    return this
  }
  timeExtent(extent: __esri.TimeExtent) {
    new QueryProps(this.query).timeExtent(extent)
    return this
  }
  units(unit: Units) {
    new QueryProps(this.query).units(unit)
    return this
  }

  whereDate(column: string, operator: ComparisonOperator, date: string | Date) {
    this._where.and().whereDate(column, operator, date)
    this._updateWhereClause()
    return this
  }

  whereYear(column: string, operator: ComparisonOperator, year: number) {
    this._where.and().whereYear(column, operator, year)
    this._updateWhereClause()
    return this
  }

  whereMonth(column: string, operator: ComparisonOperator, month: number | number[]) {
    this._where.and().whereMonth(column, operator, month)
    this._updateWhereClause()
    return this
  }

  whereDay(column: string, operator: ComparisonOperator, day: number) {
    this._where.and().whereDay(column, operator, day)
    this._updateWhereClause()
    return this
  }

  whereDayOfWeek(column: string, operator: ComparisonOperator, dayOfWeek: number | number[]) {
    this._where.and().whereDayOfWeek(column, operator, dayOfWeek)
    this._updateWhereClause()
    return this
  }

  whereTime(column: string, operator: ComparisonOperator, time: string) {
    this._where.and().whereTime(column, operator, time)
    this._updateWhereClause()
    return this
  }

  whereToday(column: string) {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    return this.whereDate(column, '=' as ComparisonOperator, todayStr)
  }

  whereYesterday(column: string) {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    const str = d.toISOString().split('T')[0]
    return this.whereDate(column, '=' as ComparisonOperator, str)
  }

  whereThisWeek(column: string) {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay())
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    return this.whereBetween(column, start, end)
  }

  whereThisMonth(column: string) {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    return this.whereBetween(column, start, end)
  }

  whereThisYear(column: string) {
    const now = new Date()
    return this.whereYear(column, '=' as ComparisonOperator, now.getFullYear())
  }

  whereLastDays(column: string, days: number) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)
    return this.whereBetween(column, startDate, endDate)
  }

  whereNextDays(column: string, days: number) {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + days)
    endDate.setHours(23, 59, 59, 999)
    return this.whereBetween(column, startDate, endDate)
  }

  whereOlderThan(column: string, days: number) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return this.whereDate(column, '<' as ComparisonOperator, cutoff)
  }

  whereNewerThan(column: string, days: number) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return this.whereDate(column, '>' as ComparisonOperator, cutoff)
  }

  whereBusinessHours(column: string) {
    this._pushClause(`EXTRACT(HOUR FROM ${column}) >= 9 AND EXTRACT(HOUR FROM ${column}) < 17`)
    this._updateWhereClause()
    return this
  }

  whereWeekdays(column: string) {
    this._pushClause(`EXTRACT(DOW FROM ${column}) BETWEEN 2 AND 6`)
    this._updateWhereClause()
    return this
  }

  whereWeekends(column: string) {
    this._pushClause(`EXTRACT(DOW FROM ${column}) IN (1, 7)`)
    this._updateWhereClause()
    return this
  }

  whereRaw(condition: string) {
    this.query.where = condition
    this._where.clear()
    return this
  }

  getWhereClause() {
    return this.query.where || '1=1'
  }

  clearWhere() {
    this._where.clear()
    this.query.where = '1=1'
    return this
  }

  clone() {
    const cloned = new QueryBuilder()
    cloned.layer = this.layer
    cloned.query = this.query.clone()
    cloned._where = this._where // WhereBuilder is immutable-by-reference here; consider deep copy if needed
    cloned._currentOp = this._currentOp
    return cloned
  }

  // condition building now handled by WhereBuilder

  private _buildWhereClause() {
    return this._where.build()
  }

  async exec() {
    if (!this.layer) {
      throw new Error('No FeatureLayer provided')
    }
    return await this.layer.queryFeatures(this.query)
  }

  async first() {
    const originalNum = this.query.num
    this.query.num = 1
    try {
      const result = await this.exec()
      return result.features && result.features.length > 0 ? result.features[0] : null
    } finally {
      this.query.num = originalNum
    }
  }

  async count() {
    const originalReturnGeometry = this.query.returnGeometry
    const originalOutFields = this.query.outFields
    this.query.returnGeometry = false
    this.query.outFields = ['OBJECTID']
    try {
      const result = await this.exec()
      return result.features ? result.features.length : 0
    } finally {
      this.query.returnGeometry = originalReturnGeometry
      this.query.outFields = originalOutFields
    }
  }

  async exists() {
    const count = await this.count()
    return count > 0
  }
}
