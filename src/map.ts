import Extent from "./extent";
import Layer from "./layer";

class Map extends Messenger {

    element: string;
    layers: Layer[];
    options: MapParameters;
    iframe: HTMLIFrameElement;

    constructor(element: string, options: MapParameters) {
        super();
        console.log('Welcome to Galigeo');
        this.options = options;
        this.element = element;

        if(!options.location) options.location = 'http://localhost:8088/Galigeo';
        
        if(this.options.location.endsWith('/')) {
            this.options.location = this.options.location.slice(0, -1);
        }
    }

    async load() {
        console.log('Loading Map');
        const response = await fetch(this.options.location + '/api/openMap/encoded', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: 'data=' + encodeURIComponent(JSON.stringify(this.options))
        });
        const json = await response.json();
        console.log(response, json);
        if (response.ok) {
            const mapDiv =  document.getElementById(this.element);
            this.iframe = document.createElement('iframe');
            this.iframe.src = `${this.options.location}/viewer/index.html?url=../${json.relativeUrlServiceUrl}`;
            this.iframe.width = '100%';
            this.iframe.height = '100%';
            mapDiv.appendChild(this.iframe);
            return json;
        } else {
            throw new Error('Failed to load map');
        }
    }
    isLoaded():boolean {
        return this.iframe !== undefined;
    }
    setExtent(extent: Extent) {
        this.postMessage('setExent', extent);
    }
}

export default Map;