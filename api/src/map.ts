import Extent from "./extent";
import Layer from "./layer";
import Messenger from "./messenger";
import Listener from "./listener";
import { MapParameters, Message } from "./model";

/**
 * The Map class contains properties and methods for storing and managing layers
 */
class Map extends Listener {

    private element: string;
    private options: MapParameters;
    private iframe: HTMLIFrameElement;
    private messenger: Messenger;
    private loaded: boolean = false;

    constructor(element: string, options: MapParameters) {
        super();
        console.log('Welcome to Galigeo');
        this.options = options;
        this.element = element;

        if (!options.url) options.url = 'https://sandbox.galigeo.com/Galigeo';
        if(options.id && !options.mapId) options.mapId = options.id; // handle legacy parameter

        if (this.options.url.endsWith('/')) {
            this.options.url = this.options.url.slice(0, -1);
        }
        if(!this.options.data) this.options.data = [];
    }

    /**
     * Create an instance of Galigeo Map
     * @returns a promise when the map is loaded
     */
    async load() {
        console.log('Loading Map');
        return new Promise((resolve, reject) => {
            fetch(this.options.url + '/api/openMap/encoded', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: 'status=200&data=' + encodeURIComponent(JSON.stringify(this.options))
            }).then(res => res.json())
                .then(json => {
                    this.iframe = this.createIframe(this.element, json);
                    this.messenger = new Messenger(this.iframe);
                    this.registerEvents();
                    console.log('API- after fetch json', json);
                    this.messenger.waitMapIsLoad().then(res => {
                        console.log('API- Map loaded', json);
                        this.loaded = true;
                        this.setMapControlsVisible(false);
                        resolve(this);
                    });
                })
                .catch(err => {
                    console.error('Failed to load map', err);
                    document.getElementById(this.element).innerHTML = `<span>${err.message}</span>`;
                    reject(err)
                });

        });
    }
    /**
     * 
     * @returns true if the map is ready to use
     */
    isLoaded(): boolean {
        return this.loaded;
    }
    /**
     * Set the extent of the map
     * @param extent The extent to set
     */
    setExtent(extent: Extent) {
        return this.messenger.postMessage('setExtent', extent);
    }
    /**
	 * Zoom to a specific location using fly method
	 * @param {Number} coordinates x coordinates to zoom in
     * @param {Number} coordinates y coordinates to zoom in
	 * @param {Number} zoom level used in the zoom
	 */
    flyTo(x:number, y: number, zoom: number) {
        return this.messenger.postMessage('flyTo', {x, y, zoom});
    }
    /**
	 * Zoom to a specific location without animations
	 * @param {Number} coordinates x coordinates to zoom in
     * @param {Number} coordinates y coordinates to zoom in
	 * @param {Number} zoom level used in the zoom
	 */
    zoomTo(x:number, y: number, zoom: number) {
        return this.messenger.postMessage('zoomTo', {x, y, zoom});
    }
    /**
	 * Take a screenshot of the map 
	 * @param {String} title of screen saved 
     * @param {Boolean} savePng save the png in your disc
	 * @param {Boolean} withLegend add legend to print
	 */
    print(withLegend: boolean, savePng: boolean, title: string): Promise<any> {
        return new Promise((resolve, reject) => {
        this.messenger.postMessage('print', {withLegend, savePng, title}).then((textBlob)=> {
            resolve(textBlob) ;
        });
    });
    }
    /**
	 	* enable navigation like zoom & pan ... when it's disabled 
	 	*/
	enableMapNavigation() {
		return this.messenger.postMessage('enableMapNavigation', {});
	}
	  	/**
	 	* disable navigation like zoom & pan ... when it's enabled 
		*/
	disableMapNavigation() {
		return this.messenger.postMessage('disableMapNavigation', {});
	}
    setMenuVisible(visible: boolean) {
        return this.messenger.postMessage('setMenuVisible', visible);
    }
    setMapControlsVisible(visible: boolean) {
        return this.messenger.postMessage('setMapControlsVisible', visible);
    }
    /**
	 * Set the basemap on the map. The list of basemap parameters is described on the
	 * main product {@link https://doc.galigeo.com/G21_0/GGO/USER_GUIDE/en/#t=Basemaps_Configuration.htm&rhsearch=basemap&rhhlterm=basemap&rhsyns=%20|documentation}.
	 * @param {String}  basemap name of the basemap
	 */
    setBasemap(basemap: string) {
        return this.messenger.postMessage('setBasemap', basemap);
    }
    /**
	 * Filter a dataset using a condition 
	 * @example map.filter('cities', 'city=Paris', ()=> {
     *   console.log("end filter");
     * });
	 * @param {String} datasetId dataset name
	 * @param {String} query The condition used to filter 
	 */
    filter(datasourceId:string, datasetId:String) {
        return this.messenger.postMessage('filter', { datasourceId, datasetId });
    }
    addDataUrl(url:string, name:string) {
        if(this.isLoaded()) throw new Error('Cannot add new data once the map is loaded');
        var httpIdx = url.toLowerCase().indexOf('http');
		if (httpIdx !== 0) {
			// in case of relative path, build the full url
			var baseIdx = window.location.href.lastIndexOf('/');
			url = window.location.href.substring(0, baseIdx + 1) + url;
		}
		this.options.data.push({
			format: 'link',
			url: url,
			name: name
		});
    }
    /**
	 * Add a array of features to the map. This function adds a new layer on the map.
	 * @param {Object[]} features 
	 * - ex: lines [{
      "type": "Feature",
      "properties": {
        "party": "abc",
        "popupContent": "popupContent !!!!!!!"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
      }
    }, {
      "type": "Feature",
      "properties": {
        "party": "abc",
        "popupContent": "popupContent !!!!!!!"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
      }
    }]
	* - ex: polygons {
      "type": "Feature",
      "properties": {
        "party": "Republican",
        "popupContent": "popupContent !!!!!!!"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-104.05, 48.99],
          [-97.22, 48.98],
          [-96.58, 45.94],
          [-104.03, 45.94],
          [-104.05, 48.99]
        ]]
      }
    }, {
      "type": "Feature",
      "properties": {
        "party": "Democrat",
        "popupContent": "popupContent !!!!!!!"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-109.05, 41.00],
          [-102.06, 40.99],
          [-102.03, 36.99],
          [-109.04, 36.99],
          [-109.05, 41.00]
        ]]
      }
    }]
	 * @param {Style | undefined} symbols a style of features
	- ex: 
      style: {
        fillColor: "#74D76F",
        color: "#74D76F",
        fillOpacity: 1,
        radius: 8,
        weight: 1
      }
	 * @returns layerId of the object in the map
	 */
    createGeojsonLayer(features: any [], style: any): Promise<Layer> {
        return new Promise((resolve, reject) => {
            this.messenger.postMessage('createGeojsonLayer', { features, style }).then(res => {
                const layer = new Layer(res.layer_id, {name: res.layer_id, isApiLayer: true, datasetId: undefined, datasourceId: undefined, visible: true, messenger: this.messenger});
                resolve(layer);
            });
        });
    }
    /**
	 * Create new marker in the position x,y with custom svg image or style
	 * @example
	 * var coordinates = [ event.lat, event.lng ];
	 * var iconSvgOptions = { iconSize : [ 40, 40 ] };
	 * var svgXml = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker" class="svg-inline--fa fa-map-marker fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="${color}" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"></path></svg>`;
	 * var url = encodeURI("data:image/svg+xml," + svgXml).replace('#', '%23');
	 * markerLayer = mapGaligeo.addMarker(coordinates, undefined, iconSvgOptions, svgXml);
	 *
	 * @param {Number[]} coordinates  [x,y] 
	 * @param {Object | undefined} style 
	 * @param {Object} iconSvgOptions ex: {iconSize: [40, 40]}
	 * @param {String} svgUrl URL of the SVG
    
	 * @returns layerLeaflet the marker object leaflet in the map
	 */
    addMarker(coordinates: number [], style: any, iconSvgOptions: any, urlSvg: any): Promise<Layer> {
        return new Promise((resolve, reject) => {
            this.messenger.postMessage('addMarker', { coordinates, style, iconSvgOptions, urlSvg }).then(res => {
                const layer = new Layer(res.layer_id, {name: res.layer_id, isApiLayer: true, datasetId: undefined, datasourceId: undefined, visible: true, messenger: this.messenger});
                resolve(layer);
            });
        });
    }
    /**
	 * Remove marker or Layer (geojson ...) from the map
	 * @param {String} Layer 
	 */
    removeLayer(layer: Layer): Promise<string> {
        return new Promise((resolve, reject) => {
            this.messenger.postMessage('removeLayerById', { layer }).then(res => {
                 resolve(res);
            });
        });
    }
    
    /**
     * Get the list of layers
     * @returns Promise<Layer[]>
     */
    getLayers(): Promise<Layer[]> {
        return new Promise((resolve, reject) => {
            this.messenger.postMessage('getLayers', null).then(messageLayers => {
                const layers: Layer[] = [];
                for (const l of messageLayers) {
                    const layer = new Layer(l.id, {name: l.name, datasetId: l.datasetId, datasourceId: l.datasourceId, visible: l.visible, messenger: this.messenger});
                    layers.push(layer);
                }
                resolve(layers);
            });
        });
    }

    /**
     * Listen the events received from the messenger then propagate
     */
    private registerEvents() {
        this.messenger.addEventListener('map', (msg:Message)=>{
            // adapt the object passed through the event to match API objects
            let value:any;
            if(msg.action === 'zoomend') {
                value = new Extent(msg.value.minX, msg.value.minY, msg.value.maxX, msg.value.maxY);
            } else {
                value = msg.value;
            }
            this.fireEvent(msg.action, value);    
        });
        
    }

    private createIframe(element: string, json: any): HTMLIFrameElement {
        const mapDiv = document.getElementById(element);
        const indexPage = this.options.devMode ? 'indexdev.jsp' : 'index.html';
        const iframe: HTMLIFrameElement = document.createElement('iframe');
        let urlOptions = 'listenMessages=true';
        if(this.options.crossDomain) urlOptions += '&crossDomain=true'
        iframe.src = `${this.options.url}/viewer/${indexPage}?${urlOptions}&url=../${json.relativeUrlServiceUrl}`;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.title = 'Galigeo Map';
        iframe.id = this.options.mapId;
        mapDiv.appendChild(iframe);
        return iframe;
    }
}

export default Map;