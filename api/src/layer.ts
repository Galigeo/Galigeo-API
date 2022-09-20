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

    getDatasourceId():String {
        return this.datasourceId;
    }
    
    setVisible(visible:boolean) {
        return this.messenger.postMessage('setVisible', visible, this);
    }

    disableInfoWindow() {
        return this.messenger.postMessage('disableInfoWindow', '', this);
    }

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