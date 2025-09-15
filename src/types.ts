// Core comparison operators
export type ComparisonOperator =
  | '='
  | '!='
  | '<>'
  | '<'
  | '<='
  | '>'
  | '>='
  | 'LIKE'
  | 'NOT LIKE'
  | 'IN'
  | 'NOT IN'
  | 'IS'
  | 'IS NOT'

export type LogicalOperator = 'AND' | 'OR'

export type SortOrder = 'ASC' | 'DESC'

// Statistic types based on ArcGIS documentation
export type StatisticType = 'sum' | 'count' | 'avg' | 'min' | 'max' | 'stddev' | 'var'

// Statistic definition interface
export interface QueryStatisticDefinitionInput {
  onStatisticField: string
  outStatisticFieldName: string
  statisticType: StatisticType
}

// Spatial relationship types based on ArcGIS documentation
export type SpatialRelationship =
  | 'intersects'
  | 'contains'
  | 'crosses'
  | 'envelope-intersects'
  | 'index-intersects'
  | 'overlaps'
  | 'touches'
  | 'within'
  | 'relation'

// SQL format types
export type SqlFormat = 'standard' | 'native'

// Multipatch option types
export type MultipatchOption = 'xyFootprint' | 'fullShape'

// Datum transformation types
export interface SimpleTransformation {
  wkid: number
}

export interface CompositeTransformation {
  geoTransforms: Array<{
    wkid: number
    transformForward: boolean
  }>
}

export type DatumTransformation = number | SimpleTransformation | CompositeTransformation

// Quantization parameters
export interface QuantizationParameters {
  extent?: __esri.Extent
  mode?: 'view' | 'edit'
  originPosition?: 'upper-left' | 'lower-left'
  tolerance?: number
  useRatio?: boolean
}

// Range values for queries
export interface RangeValue {
  name: string
  value: number | number[]
  range: [number, number]
}

// Parameter values for queries
export interface ParameterValue {
  name: string
  value: any
}

// Pixel size for image services
export interface PixelSize {
  x: number
  y: number
}

// Units for spatial queries
export type SpatialUnit =
  | 'feet'
  | 'kilometers'
  | 'meters'
  | 'miles'
  | 'nautical-miles'
  | 'us-nautical-miles'

// Cache hint types
export type CacheHint = boolean

// Object ID types
export type ObjectId = number | string

// Field types for outFields
export type OutField = string | '*'

// Order by field types
export type OrderByField = string

// Group by field types
export type GroupByField = string

// Having expression type
export type HavingExpression = string

// Relation parameter type
export type RelationParameter = string

// Text search type
export type TextSearch = string

// Units type for distance queries
export type DistanceUnit = SpatialUnit

// Historic moment type
export type HistoricMoment = Date

// Geometry precision type
export type GeometryPrecision = number

// Max allowable offset type
export type MaxAllowableOffset = number

// Max record count factor type
export type MaxRecordCountFactor = number

// GDB version type
export type GdbVersion = string

// Distance type for spatial queries
export type Distance = number

// Having clause type
export type Having = string

// Multipatch option type
export type MultipatchOptionType = MultipatchOption

// Object IDs type
export type ObjectIds = ObjectId[]

// Parameter values type
export type ParameterValues = Record<string, any>

// Pixel size type
export type PixelSizeType = PixelSize

// Quantization parameters type
export type QuantizationParametersType = QuantizationParameters

// Range values type
export type RangeValues = RangeValue[]

// Relation parameter type
export type RelationParameterType = RelationParameter

// Return centroid type
export type ReturnCentroid = boolean

// Return exceeded limit features type
export type ReturnExceededLimitFeatures = boolean

// Return M type
export type ReturnM = boolean

// Return query geometry type
export type ReturnQueryGeometry = boolean

// Return Z type
export type ReturnZ = boolean

// SQL format type
export type SqlFormatType = SqlFormat

// Text type
export type Text = TextSearch

// Units type
export type Units = DistanceUnit
