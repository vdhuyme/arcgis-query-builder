# ArcGIS Query Builder

[![npm version](https://img.shields.io/npm/v/arcgis-query-builder.svg)](https://www.npmjs.com/package/arcgis-query-builder)
[![Build](https://github.com/vdhuyme/arcgis-query-builder/actions/workflows/publish.yml/badge.svg)](https://github.com/vdhuyme/arcgis-query-builder/actions/workflows/release.yml)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A lightweight and fluent query builder for ArcGIS FeatureLayers, inspired by modern query builders. This package provides an intuitive API for building complex queries for ArcGIS FeatureLayers with TypeScript support.

## Installation

```bash
npm install arcgis-query-builder
```

## Features

- Fluent API for building ArcGIS FeatureLayer queries
- Full TypeScript support
- Advanced query operations (where, select, orderBy, groupBy, etc.)
- Rich date-time query helpers
- Spatial query support
- Statistics and aggregation functions
- Query chaining and composition

## Quick Start

```typescript
import { QueryBuilder } from 'arcgis-query-builder'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'

// Create a query builder from a FeatureLayer
const layer = new FeatureLayer({ url: 'your-feature-layer-url' })
const query = QueryBuilder.from(layer)

// Build and execute a query
const results = await query
  .select(['NAME', 'POPULATION'])
  .where('POPULATION', '>', 1000000)
  .orderBy('POPULATION', 'DESC')
  .limit(10)
  .exec()
```

## Basic Usage

### Simple Queries

```typescript
// Basic where clause
query.where('field', '=', 'value')

// Multiple conditions
query.where('age', '>=', 18).where('status', '=', 'active')

// OR conditions
query.where('type', '=', 'A').orWhere('type', '=', 'B')
```

### Advanced Queries

```typescript
// Complex where clauses
query.where(qb => {
  qb.where('status', '=', 'active').where('age', '>=', 18)
})

// Between values
query.whereBetween('price', 10, 100)

// IN clause
query.whereIn('category', ['A', 'B', 'C'])

// NULL checks
query.whereNull('optional_field')
query.whereNotNull('required_field')
```

### Date Queries

```typescript
// Date specific queries
query.whereDate('created_at', '=', '2025-01-01')
query.whereToday('timestamp')
query.whereThisWeek('date_field')
query.whereThisMonth('date_field')
query.whereLastDays('date_field', 7)

// Business hours
query.whereBusinessHours('time_field')
query.whereWeekdays('date_field')
```

### Aggregations and Statistics

```typescript
// Group by with statistics
query.groupBy('category').stats([
  { field: 'price', type: 'avg', alias: 'average_price' },
  { field: 'quantity', type: 'sum', alias: 'total_quantity' }
])

// Single statistic
query.addStat('population', 'sum', 'total_population')
```

### Pagination

```typescript
// Using limit and offset
query.limit(10).offset(20)

// Or using paginate
query.paginate(2, 10) // page 2, 10 items per page
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Install dependencies (`npm install`)
4. Make your changes
5. Run the tests (`npm test`)
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/vdhuyme/arcgis-query-builder.git

# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

- Create an issue on [GitHub](https://github.com/vdhuyme/arcgis-query-builder/issues)
- Contact the maintainer: vdhuyme

## Acknowledgments

- Thanks to all contributors who have helped with code, bug reports, and suggestions
- Inspired by modern query builders
- Built with TypeScript and ArcGIS API for JavaScript
