
## ![Galigeo](https://showroom.galigeo.com/Galigeo/viewer/ui/img/logogaligeo.png) API Reference


This API provides a set of functions to embed Galigeo Maps into a web page.

### Getting started

1. Download the JS API from https://api.galigeo.com/showcase/assets/js/galigeo-api.js
2. Add it to your web page `<script type="text/javascript" src="js/galigeo-api.js"></script>`
3. Add a div to the web page that will contain the map  `<div id="ggoMapId"></div>`
4. Init the map with Javascript: 

```javascript
var ggoMap = new Galigeo.Map('ggoMapId',
{
    mapId: 'MyMap',
    name: 'Map label',
    apiKey: 'Your API key',
    url: 'https://location/Galigeo'
});
ggoMap.load().then(()=>{
    // work with the map
});
```

[Check our API samples](https://api.galigeo.com/showcase)

### Supported Data Formats

The OpenMap API supports multiple data formats for inline and referenced datasets. Use the `format` field to specify the data type.

#### Format: `arcgis_inline`

ESRI/ArcGIS inline format with explicit field definitions and ESRI geometries.

**Example:**
```javascript
{
  "format": "arcgis_inline",
  "id": "sales-data",
  "name": "Sales by Region",
  "fields": [
    {"name": "OBJECTID", "type": "esriFieldTypeOID", "alias": "ID"},
    {"name": "region", "type": "esriFieldTypeString", "alias": "Region"},
    {"name": "sales", "type": "esriFieldTypeDouble", "alias": "Sales Amount"}
  ],
  "features": [
    {
      "attributes": {"OBJECTID": 1, "region": "North", "sales": 150000},
      "geometry": {"x": -122.4194, "y": 37.7749}
    }
  ],
  "geometryType": "esriGeometryPoint"
}
```

**Use cases:**
- Precise field type control (numeric, date, string)
- ESRI ecosystem integration
- Existing ArcGIS feature services data

#### Format: `geojson_inline`

Standard GeoJSON FeatureCollection format. Field types are automatically inferred as strings.

**Example:**
```javascript
{
  "format": "geojson_inline",
  "id": "cities",
  "name": "World Cities",
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [2.3522, 48.8566]
      },
      "properties": {
        "name": "Paris",
        "country": "France",
        "population": 2161000
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[0,0], [10,0], [10,10], [0,10], [0,0]]]
      },
      "properties": {
        "region": "North",
        "area": 100
      }
    }
  ]
}
```

**Supported geometry types:**
- Point, MultiPoint
- LineString, MultiLineString
- Polygon, MultiPolygon

**Use cases:**
- Standard GeoJSON data sources
- Web mapping applications (Leaflet, Mapbox)
- OpenStreetMap exports
- Simplified data structure without field type definitions

**Notes:**
- Coordinates must be in WGS84 (longitude, latitude)
- All fields are imported as string type
- Properties are automatically discovered from all features

#### Format: `link`

Reference to external data via URL (CSV files or GeoServices).

**Example:**
```javascript
{
  "format": "link",
  "id": "external-data",
  "name": "External Dataset",
  "url": "https://example.com/data.csv"
}
```

**Supported sources:**
- CSV files (with or without geometry columns)
- GeoService endpoints
- External REST APIs

#### Format: `local_file`

Reference to a local file stored on the server (used internally after processing inline datasets).

**Example:**
```javascript
{
  "format": "local_file",
  "id": "cached-data",
  "name": "Cached Dataset",
  "url": "/path/to/data.csv"
}
```

**Notes:**
- Automatically created when storing `arcgis_inline` or `geojson_inline` datasets
- Points to CSV files in the OpenMap cache directory
- Not typically used in API requests (internal format)

#### Common Properties

All formats support these additional properties:

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `id` | string | Unique dataset identifier | Auto-generated |
| `name` | string | Display name | Required |
| `aliasEditable` | boolean | Allow field alias editing | `true` |
| `mapper` | object | Field mapping configuration for joins | `null` |

**Mapper example (JoinMapper):**
```javascript
{
  "format": "geojson_inline",
  "id": "regions",
  "name": "Sales Regions",
  "mapper": {
    "id": "99",
    "name": "Region Mapper",
    "dataField": "region_code",
    "gisField": "REGION_ID",
    "geometryType": "esriGeometryPolygon"
  },
  "features": [...]
}
```

#### Format Comparison

| Feature | arcgis_inline | geojson_inline | link | local_file |
|---------|---------------|----------------|------|------------|
| Field type control | ✓ Explicit | String only | Depends on source | Depends on source |
| Geometry types | ESRI types | GeoJSON types | Varies | Varies |
| Inline data | ✓ | ✓ | ✗ (URL) | ✗ (File path) |
| Standard compliance | ESRI | RFC 7946 | N/A | N/A |
| Auto field discovery | ✗ | ✓ | Depends | Depends |

#### Complete Example: Multi-Dataset Map

```javascript
var ggoMap = new Galigeo.Map('mapDiv', {
  mapId: 'multi-format-demo',
  name: 'Multi-Format Map',
  apiKey: 'your-api-key',
  url: 'https://your-server/Galigeo',
  data: [
    {
      format: 'geojson_inline',
      id: 'stores',
      name: 'Store Locations',
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {type: 'Point', coordinates: [2.35, 48.85]},
          properties: {name: 'Paris Store', revenue: 500000}
        }
      ]
    },
    {
      format: 'arcgis_inline',
      id: 'regions',
      name: 'Sales Regions',
      fields: [
        {name: 'FID', type: 'esriFieldTypeOID'},
        {name: 'region', type: 'esriFieldTypeString'},
        {name: 'target', type: 'esriFieldTypeDouble'}
      ],
      features: [
        {
          attributes: {FID: 1, region: 'North', target: 1000000},
          geometry: {rings: [[[0,0], [10,0], [10,10], [0,10], [0,0]]]}
        }
      ],
      geometryType: 'esriGeometryPolygon'
    },
    {
      format: 'link',
      id: 'demographics',
      name: 'Demographics Data',
      url: 'https://data.example.com/demographics.csv'
    }
  ]
});
```

### Product documentation

Main product documentation.

* [Documentation EN](https://doc.galigeo.com/latest/GGO/USER_GUIDE/en)
* [Documentation FR](https://doc.galigeo.com/latest/GGO/USER_GUIDE/fr)
