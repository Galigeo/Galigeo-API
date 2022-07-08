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
                body: 'data=' + encodeURIComponent(JSON.stringify(this.options))
            }).then(res => res.json())
                .then(json => {
                    this.iframe = this.createIframe(this.element, json);
                    this.messenger = new Messenger(this.iframe);
                    this.registerEvents();
                    console.log('API- after fetch json', json);
                    this.messenger.waitMapIsLoad().then(res => {
                        console.log('API- Map loaded', json);
                        this.loaded = true;
                        resolve(json);
                    });
                })
                .catch(err => reject(err));;

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
    setMenuVisible(visible: boolean) {
        return this.messenger.postMessage('setMenuVisible', visible);
    }
    setBasemap(basemap: string) {
        return this.messenger.postMessage('setBasemap', basemap);
    }
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