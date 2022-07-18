import Layer from "./layer";
import Listener from "./listener";
import { Message } from "./model";

/**
 * The Messenger handles the communication with the Galigeo
 * viewer through messages.
 * 
 * Each message is sent with an ID. The viewer sends back
 * responses with the same ID. These responses are wrapped
 * in a Promise to handle return types transparently.
 * 
 * @ignore
 */
class Messenger extends Listener {

    iframe: HTMLIFrameElement;
    ready: boolean = false;
    private responses:Map<string, Message> = new Map<string, Message>();
    private idCounter:number = 1;
    
    constructor(iframe: HTMLIFrameElement) {
        super();
        this.iframe = iframe;
        this.registerEvents();
    }
    /**
     * Register all post messages event from iframe
     */
    registerEvents() {
        const childWindow = this.iframe as HTMLIFrameElement;
        console.log('API - Listen for messages', childWindow.contentWindow);
        window.addEventListener('message', (evt: MessageEvent) => {
            if (evt.source !== childWindow.contentWindow) {
                console.warn('API- Skip', evt);
                return; // Skip message from other source
            }

            // skip case map loaded ; already handled by waitMapIsLoad()
            if (evt.data === 'GaligeoMapLoaded') {
               return;
            }
            const msg = new Message(evt.data);

            // Handle messages of type 'response'
            if (msg.type === 'response') {
                console.log('API- receive response', msg);
                const response:Message = this.responses.get(msg.id);
                if(response) {
                    console.log('API- resolve response', response);
                    this.responses.delete(msg.id);
                    response.resolve(msg.value);
                } else console.warn('API- Missing response handler for message ', msg);
            }

            // Handle events
            if (msg.type === 'event') {
                this.fireEvent(msg.source, msg);
            }

        });
    }
    /**
     * Wait for the message 'GaligeoMapLoaded' from the iframe
     * @returns a Promise
     */
    waitMapIsLoad():Promise<string> {
        return new Promise((resolve, reject) => {
            window.addEventListener('message', (evt: MessageEvent) => {
                if (evt.data === 'GaligeoMapLoaded') {
                    this.ready = true;
                    resolve('map loaded');
                }
            });
            setTimeout(() => {
                if (!this.ready) {
                    reject('Timeout excedeed, failed to load map');
                }
            }, 20000);
        });
    }
    postMessage(action: string, value: any, layer?:Layer) {
        return new Promise<any>((resolve:Function, reject:Function)=>{
            const message = new Message();
            message.source = 'api';
            message.type = 'function';
            message.action = action;
            message.value = value;
            message.id = '' + this.idCounter++;
            message.layer = layer;
    
            if (!this.ready) {
                throw new Error('Map not ready, unable to send messages');
            } else {
                console.log('API- action =', action, message);
                const response = new Message();
                response.resolve = resolve;
                this.responses.set(message.id, response);
                this.iframe.contentWindow.postMessage(JSON.stringify(message), "*");
            }
        });
        
    }

}
export default Messenger;
