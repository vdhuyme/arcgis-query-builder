import Query from "@arcgis/core/rest/support/Query.js";

export class QueryProps {
  constructor(private q: Query) {}

  cacheHint(flag: boolean) {
    this.q.cacheHint = flag as any;
    return this;
  }
  datumTransformation(t: number | any) {
    this.q.datumTransformation = t as any;
    return this;
  }
  distance(value: number) {
    this.q.distance = value as any;
    return this;
  }
  gdbVersion(version: string) {
    this.q.gdbVersion = version as any;
    return this;
  }
  geometryPrecision(precision: number) {
    this.q.geometryPrecision = precision as any;
    return this;
  }
  having(expr: string) {
    this.q.having = expr as any;
    return this;
  }
  historicMoment(date: Date) {
    this.q.historicMoment = date as any;
    return this;
  }
  maxAllowableOffset(offset: number) {
    this.q.maxAllowableOffset = offset as any;
    return this;
  }
  maxRecordCountFactor(factor: number) {
    (this.q as any).maxRecordCountFactor = factor;
    return this;
  }
  multipatchOption(option: string) {
    (this.q as any).multipatchOption = option;
    return this;
  }
  objectIds(ids: Array<number | string>) {
    this.q.objectIds = ids as any;
    return this;
  }
  outSpatialReference(sr: __esri.SpatialReference) {
    this.q.outSpatialReference = sr as any;
    return this;
  }
  parameterValues(values: Record<string, any>) {
    (this.q as any).parameterValues = values;
    return this;
  }
  pixelSize(p: __esri.Point) {
    (this.q as any).pixelSize = p;
    return this;
  }
  quantizationParameters(q: any) {
    (this.q as any).quantizationParameters = q;
    return this;
  }
  rangeValues(values: any[]) {
    (this.q as any).rangeValues = values;
    return this;
  }
  relationParameter(param: string) {
    this.q.relationParameter = param as any;
    return this;
  }
  returnCentroid(flag: boolean) {
    this.q.returnCentroid = flag as any;
    return this;
  }
  returnExceededLimitFeatures(flag: boolean) {
    this.q.returnExceededLimitFeatures = flag as any;
    return this;
  }
  returnM(flag: boolean) {
    this.q.returnM = flag as any;
    return this;
  }
  returnQueryGeometry(flag: boolean) {
    this.q.returnQueryGeometry = flag as any;
    return this;
  }
  returnZ(flag: boolean) {
    this.q.returnZ = flag as any;
    return this;
  }
  sqlFormat(fmt: "standard" | "native") {
    (this.q as any).sqlFormat = fmt;
    return this;
  }
  textLike(text: string) {
    this.q.text = text as any;
    return this;
  }
  timeExtent(extent: __esri.TimeExtent) {
    this.q.timeExtent = extent as any;
    return this;
  }
  units(unit: string) {
    (this.q as any).units = unit;
    return this;
  }
}
