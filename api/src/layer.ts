import Listener from "./listener";
import Messenger from "./messenger";
import { Message } from "./model";

class Layer extends Listener {
    private id: string;
    private name: string;
    private datasourceId: string;
    private datasetId: string;
    private visible: boolean;
    private isApiLayer: boolean;
    private messenger: Messenger;

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

    getId():String {
        return this.id;
    }

    getName():String {
        return this.name;
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