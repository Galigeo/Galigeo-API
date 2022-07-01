import Listener from "./listener";
import Messenger from "./messenger";
import { Message } from "./model";

class Layer extends Listener {
    private id: string;
    private name: string;
    private datasourceId: string;
    private datasetId: string;
    private messenger: Messenger;

    constructor(id: string, name: string, messenger?: Messenger) {
        super();
        this.id = id;
        this.name = name;
        this.messenger = messenger;
        if(messenger) {
            this.registerEvents();
        }
    }

    getId():String {
        return this.id;
    }

    getName():String {
        return this.name;
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