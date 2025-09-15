import Query from '@arcgis/core/rest/support/Query.js'
import {
  CacheHint,
  DatumTransformation,
  Distance,
  GdbVersion,
  GeometryPrecision,
  HavingExpression,
  HistoricMoment,
  MaxAllowableOffset,
  MaxRecordCountFactor,
  MultipatchOption,
  ObjectIds,
  ParameterValues,
  PixelSizeType,
  QuantizationParametersType,
  RangeValues,
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

export class QueryProps {
  constructor(private q: Query) {}

  cacheHint(flag: CacheHint) {
    this.q.cacheHint = flag
    return this
  }

  datumTransformation(t: DatumTransformation) {
    this.q.datumTransformation = t
    return this
  }

  distance(value: Distance) {
    this.q.distance = value
    return this
  }

  gdbVersion(version: GdbVersion) {
    this.q.gdbVersion = version
    return this
  }

  geometryPrecision(precision: GeometryPrecision) {
    this.q.geometryPrecision = precision
    return this
  }

  having(expr: HavingExpression) {
    this.q.having = expr
    return this
  }

  historicMoment(date: HistoricMoment) {
    this.q.historicMoment = date
    return this
  }

  maxAllowableOffset(offset: MaxAllowableOffset) {
    this.q.maxAllowableOffset = offset
    return this
  }

  maxRecordCountFactor(factor: MaxRecordCountFactor) {
    this.q.maxRecordCountFactor = factor
    return this
  }

  multipatchOption(option: MultipatchOption) {
    this.q.multipatchOption = option
    return this
  }

  objectIds(ids: ObjectIds) {
    this.q.objectIds = ids
    return this
  }

  outSpatialReference(sr: __esri.SpatialReference) {
    this.q.outSpatialReference = sr
    return this
  }

  parameterValues(values: ParameterValues) {
    this.q.parameterValues = values
    return this
  }

  pixelSize(p: PixelSizeType) {
    this.q.pixelSize = p
    return this
  }

  quantizationParameters(q: QuantizationParametersType) {
    this.q.quantizationParameters = q
    return this
  }

  rangeValues(values: RangeValues) {
    this.q.rangeValues = values
    return this
  }

  relationParameter(param: RelationParameter) {
    this.q.relationParameter = param
    return this
  }

  returnCentroid(flag: ReturnCentroid) {
    this.q.returnCentroid = flag
    return this
  }

  returnExceededLimitFeatures(flag: ReturnExceededLimitFeatures) {
    this.q.returnExceededLimitFeatures = flag
    return this
  }

  returnM(flag: ReturnM) {
    this.q.returnM = flag
    return this
  }

  returnQueryGeometry(flag: ReturnQueryGeometry) {
    this.q.returnQueryGeometry = flag
    return this
  }

  returnZ(flag: ReturnZ) {
    this.q.returnZ = flag
    return this
  }

  sqlFormat(fmt: SqlFormat) {
    this.q.sqlFormat = fmt
    return this
  }

  textLike(text: TextSearch) {
    this.q.text = text
    return this
  }

  timeExtent(extent: __esri.TimeExtent) {
    this.q.timeExtent = extent
    return this
  }

  units(unit: Units) {
    this.q.units = unit
    return this
  }
}
