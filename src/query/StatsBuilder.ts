import { QueryStatisticDefinitionInput, StatisticType } from '../types'

// ArcGIS StatisticDefinition interface based on documentation
export interface StatisticDefinition {
  onStatisticField: string
  outStatisticFieldName: string
  statisticType: StatisticType
}

export class StatsBuilder {
  private stats: QueryStatisticDefinitionInput[] = []

  add(def: QueryStatisticDefinitionInput) {
    this.validate(def)
    this.stats.push(def)
    return this
  }

  addSimple(field: string, type: StatisticType, alias?: string) {
    return this.add({
      onStatisticField: field,
      outStatisticFieldName: alias || `${type}_${field}`,
      statisticType: type
    })
  }

  merge(defs: QueryStatisticDefinitionInput | QueryStatisticDefinitionInput[]) {
    const list = Array.isArray(defs) ? defs : [defs]
    list.forEach(d => this.add(d))
    return this
  }

  build(): StatisticDefinition[] {
    return this.stats as StatisticDefinition[]
  }

  private validate(s: QueryStatisticDefinitionInput) {
    if (!s.onStatisticField || !s.outStatisticFieldName || !s.statisticType) {
      throw new Error(
        'Each statistic must have onStatisticField, outStatisticFieldName, and statisticType'
      )
    }
  }
}
