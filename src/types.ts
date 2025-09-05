export type ComparisonOperator =
  | "="
  | "!="
  | "<>"
  | "<"
  | "<="
  | ">"
  | ">="
  | "LIKE"
  | "NOT LIKE"
  | "IN"
  | "NOT IN"
  | "IS"
  | "IS NOT";

export type LogicalOperator = "AND" | "OR";

export type SortOrder = "ASC" | "DESC";

export type StatisticType =
  | "sum"
  | "count"
  | "avg"
  | "min"
  | "max"
  | "stddev"
  | "var";

export interface QueryStatisticDefinitionInput {
  onStatisticField: string;
  outStatisticFieldName: string;
  statisticType: StatisticType;
}

export type SpatialRelationship =
  | "intersects"
  | "contains"
  | "crosses"
  | "envelope-intersects"
  | "index-intersects"
  | "overlaps"
  | "touches"
  | "within"
  | "relation";
