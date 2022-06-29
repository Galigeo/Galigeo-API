import { Message } from "./model";

class Messenger {

    iframe: HTMLIFrameElement;
    ready: boolean = false;
    responses:Map<string, Message> = new Map<string, Message>();

    constructor(iframe: HTMLIFrameElement) {
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
                }
            }

            // Handle events
            if (msg.type === 'event' && msg.action === 'zoomend') {
                console.log('Zoom end');
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
            }, 5000);
        });
    }
    postMessage(action: string, value: any) {
        return new Promise<any>((resolve:Function, reject:Function)=>{
            const message = new Message();
            message.source = 'api';
            message.type = 'function';
            message.action = action;
            message.value = value;
            message.id = Date.now()+'';
    
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
