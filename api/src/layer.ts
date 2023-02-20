import Listener from "./listener";
import Messenger from "./messenger";
import { Message } from "./model";

/**
 * A map layer defined by an ID and a name
 */
class Layer extends Listener {
    private id: string;
    private name: string;
    private datasourceId: string;
    private datasetId: string;
    private visible: boolean;
    private isApiLayer: boolean;
    private messenger: Messenger;

    /**
     * 
     * @param id 
     * @param options
     * @ignore 
     */
    constructor(id: string, options: {name?: string, datasourceId?:string, datasetId?:string,  visible?: boolean, messenger?: Messenger, isApiLayer?: boolean}) {
        super();
        this.id = id;
        this.name = options.name ? options.name : id;
        this.datasourceId = options.datasourceId;
        this.datasetId = options.datasetId;
        this.visible = options.visible;
        this.isApiLayer = options.isApiLayer;
        this.messenger = options.messenger;
        if(this.messenger) {
            this.registerEvents();
        }
    }

    /**
     * 
     * @returns the unique ID of the layer
     */    
    getId():String {
        return this.id;
    }

    /**
     * 
     * @returns the name of the layer
     */
    getName():String {
        return this.name;
    }

    /**
     * 
     * @returns the dataset ID used by this layer
     */
    getDatasetId():String {
        return this.datasetId;
    }

    /**
     * 
     * @returns true is the layer's dataset is provided directly through the API
     */
    isIssuedFromAPIData():boolean {
        return this.datasourceId && this.datasourceId === 'CE';
    }

    /**
     * The datasource ID can be: Datahub, CSV, Excel, Shape, GeoJSON, catalog, sql.
     * A datasourceId=CE means the dataset is dynamically loaded by the API.
     * @returns the datasource ID of the layer.
     */
    getDatasourceId():String {
        return this.datasourceId;
    }
    /**
     * 
     * @param visible true to set visible, false to hide the layer
     */
    setVisible(visible:boolean) {
        return this.messenger.postMessage('setVisible', visible, this);
    }
    /**
     * Disable the infowindow on this layer. This method is useful if you
     * want to implement your own infowindow outside of the map.
     */
    disableInfoWindow() {
        return this.messenger.postMessage('disableInfoWindow', '', this);
    }
    /**
     * Filter the layer with a where clause. For example 'pop>2000'
     * @param where The where clause
     */
    filter(where:string) {
        return this.messenger.postMessage('filter', where, this);
    }

    /**
     * Listen the events received from the messenger then propagate
     */
     private registerEvents() {
        this.messenger.addEventListener('layer', (msg:Message)=>{
            if(msg.layer && msg.layer.id === this.id) {
                this.fireEvent(msg.action, msg.value);    
            }
        });
        
    }
}

export default Layer