
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

### Product documentation

Main product documentation.

* [Documentation EN](https://doc.galigeo.com/latest/GGO/USER_GUIDE/en)
* [Documentation FR](https://doc.galigeo.com/latest/GGO/USER_GUIDE/fr)
