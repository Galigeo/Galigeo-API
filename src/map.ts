import Extent from "./extent";
import Layer from "./layer";
import Messenger from "./messenger";
import { MapParameters } from "./model";

/**
 * The Map class contains properties and methods for storing and managing layers
 */
class Map {

    element: string;
    private options: MapParameters;
    private iframe: HTMLIFrameElement;
    private messenger: Messenger;
    private loaded: boolean = false;

    constructor(element: string, options: MapParameters) {
        console.log('Welcome to Galigeo');
        this.options = options;
        this.element = element;

        if (!options.location) options.location = 'http://localhost:8088/Galigeo';

        if (this.options.location.endsWith('/')) {
            this.options.location = this.options.location.slice(0, -1);
        }
    }

    /**
     * Create an instance of Galigeo Map
     * @returns a promise when the map is loaded
     */
    async load() {
        console.log('Loading Map');
        return new Promise((resolve, reject) => {
            fetch(this.options.location + '/api/openMap/encoded', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: 'data=' + encodeURIComponent(JSON.stringify(this.options))
            }).then(res => res.json())
            .then(json => {
                
                const mapDiv = document.getElementById(this.element);
                const indexPage = this.options.devMode ? 'indexdev.jsp' : 'index.html';
                this.iframe = this.createIframe(this.element, json);
                this.messenger = new Messenger(this.iframe);
                console.log('API- after fetch json', json);
                this.messenger.waitMapIsLoad().then(res=>{
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
    /**
     * Get the list of layers
     * @returns Promise<Layer[]>
     */
    getLayers():Promise<Layer[]> {
        return new Promise((resolve, reject) => {
            this.messenger.postMessage('getLayers', null).then(messageLayers=>{
                const layers:Layer[] = [];
                for(const l of messageLayers) {
                    const layer = new Layer(l.id, l.name, this.messenger);
                    layers.push(layer);
                }
                resolve(layers);
            });
        });
    }

    private createIframe(element: string, json: any): HTMLIFrameElement {
        const mapDiv = document.getElementById(element);
        const indexPage = this.options.devMode ? 'indexdev.jsp' : 'index.html';
        const iframe: HTMLIFrameElement = document.createElement('iframe');
        iframe.src = `${this.options.location}/viewer/${indexPage}?url=../${json.relativeUrlServiceUrl}`;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.title = 'Galigeo Map';
        iframe.id = this.options.mapId;
        mapDiv.appendChild(iframe);
        return iframe;
    }
}

export default Map;