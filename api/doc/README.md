
## ![Galigeo](https://showroom.galigeo.com/Galigeo/viewer/ui/img/logogaligeo.png) API Reference


This API provides a set of functions to embed Galigeo Maps into a web page.

### Getting started

1. Download the JS API from https://api.galigeo.com/showcase/assets/js/galigeo-api.js
2. Add it to your web page `<script type="text/javascript" src="js/galigeo-api-0.1.js"></script>`
3. Add a map div  `<div id="ggoMapId"></div>`
4. Start the map 

```javascript
var ggoMap = new Galigeo.Map('ggoMapId',
{
    mapId: 'MyMap',
    name: 'Map label',
    url: 'https://location/Galigeo'
});
ggoMap.load().then(()=>{
    // work with the map
});
```

[Check our API samples](https://api.galigeo.com/showcase)


### REST API documentation

This document describes the basic usages of the API, REST calls and rights management.

* [Documentation EN](../Galigeo_OpenMap_REST-API_en.pdf)
* [Documentation FR](../Galigeo_OpenMap_REST-API_fr.pdf)

### Javascript documentation

The JSDoc list of the Javascript functions used to interact with the map.

* [Galigeo.Map functions](Galigeo.Map.html)
* [Global objects](global.html)

### Product documentation

Main product documentation.

* [Documentation EN](https://doc.galigeo.com/G21_0/GGO/USER_GUIDE/en)
* [Documentation FR](https://doc.galigeo.com/G21_0/GGO/USER_GUIDE/fr)
