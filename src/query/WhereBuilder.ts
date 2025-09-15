import { ComparisonOperator, LogicalOperator } from '../types'
import { formatDateValue, formatValue, timeToSeconds } from '../utils'

export class WhereBuilder {
  private clauses: string[] = []
  private ops: LogicalOperator[] = []
  private currentOp: LogicalOperator = 'AND'

  pushRaw(condition: string) {
    if (!condition) return this
    if (this.clauses.length === 0) this.clauses.push(condition)
    else {
      this.ops.push(this.currentOp)
      this.clauses.push(condition)
    }
    return this
  }

  and() {
    this.currentOp = 'AND'
    return this
  }
  or() {
    this.currentOp = 'OR'
    return this
  }

  build(): string {
    if (this.clauses.length === 0) return '1=1'
    let clause = this.clauses[0] || ''
    for (let i = 1; i < this.clauses.length; i++) {
      clause += ` ${this.ops[i - 1] || 'AND'} ${this.clauses[i]}`
    }
    return clause
  }

  clear() {
    this.clauses = []
    this.ops = []
    this.currentOp = 'AND'
    return this
  }

  where(
    column: string,
    operator: ComparisonOperator,
    value: string | number | Date | boolean | null | undefined
  ) {
    this.pushRaw(this._buildCondition(column, operator, value))
    return this
  }

  whereBetween(column: string, min: string | number | Date, max: string | number | Date) {
    return this.pushRaw(`${column} BETWEEN ${formatValue(min)} AND ${formatValue(max)}`)
  }

  whereNotBetween(column: string, min: string | number | Date, max: string | number | Date) {
    return this.pushRaw(`${column} NOT BETWEEN ${formatValue(min)} AND ${formatValue(max)}`)
  }

  whereIn(column: string, values: Array<string | number>) {
    const formatted = values.map(formatValue).join(', ')
    return this.pushRaw(`${column} IN (${formatted})`)
  }

  whereNotIn(column: string, values: Array<string | number>) {
    const formatted = values.map(formatValue).join(', ')
    return this.pushRaw(`${column} NOT IN (${formatted})`)
  }

  whereNull(column: string) {
    return this.pushRaw(`${column} IS NULL`)
  }
  whereNotNull(column: string) {
    return this.pushRaw(`${column} IS NOT NULL`)
  }
  whereLike(column: string, pattern: string) {
    return this.pushRaw(`${column} LIKE ${formatValue(pattern)}`)
  }
  whereNotLike(column: string, pattern: string) {
    return this.pushRaw(`${column} NOT LIKE ${formatValue(pattern)}`)
  }

  whereDate(column: string, operator: ComparisonOperator, date: string | Date) {
    return this.pushRaw(`${column} ${operator} ${formatDateValue(date, 'date')}`)
  }

  whereYear(column: string, operator: ComparisonOperator, year: number) {
    return this.pushRaw(`EXTRACT(YEAR FROM ${column}) ${operator} ${year}`)
  }

  whereMonth(column: string, operator: ComparisonOperator, month: number | number[]) {
    if (operator === 'IN' || operator === 'NOT IN') {
      const values = Array.isArray(month) ? month.join(', ') : month
      return this.pushRaw(`EXTRACT(MONTH FROM ${column}) ${operator} (${values})`)
    }
    return this.pushRaw(`EXTRACT(MONTH FROM ${column}) ${operator} ${month}`)
  }

  whereDay(column: string, operator: ComparisonOperator, day: number) {
    return this.pushRaw(`EXTRACT(DAY FROM ${column}) ${operator} ${day}`)
  }

  whereDayOfWeek(column: string, operator: ComparisonOperator, dayOfWeek: number | number[]) {
    if (operator === 'IN' || operator === 'NOT IN') {
      const values = Array.isArray(dayOfWeek) ? dayOfWeek.join(', ') : dayOfWeek
      return this.pushRaw(`EXTRACT(DOW FROM ${column}) ${operator} (${values})`)
    }
    return this.pushRaw(`EXTRACT(DOW FROM ${column}) ${operator} ${dayOfWeek}`)
  }

  whereTime(column: string, operator: ComparisonOperator, time: string) {
    return this.pushRaw(
      `EXTRACT(HOUR FROM ${column}) * 3600 + EXTRACT(MINUTE FROM ${column}) * 60 + EXTRACT(SECOND FROM ${column}) ${operator} ${timeToSeconds(
        time
      )}`
    )
  }

  private _buildCondition(
    column: string,
    operator: ComparisonOperator,
    value: string | number | Date | boolean | null | undefined
  ) {
    if (value === null || value === undefined) {
      if (operator === '=' || (operator as string) === '==') return `${column} IS NULL`
      if (operator === '!=' || operator === '<>') return `${column} IS NOT NULL`
    }
    return `${column} ${operator} ${formatValue(value)}`
  }
}
