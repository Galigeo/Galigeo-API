import { Message } from "./model";

class Messenger {

    iframe: HTMLIFrameElement;
    pendingMessages: Message[] = [];
    ready: boolean = false;

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
            if (evt.data === 'GaligeoMapLoaded' && !this.ready) {
                console.log('API- Map is ready');
                this.ready = true;

                // send messages prior to map initialization
                if (this.pendingMessages) {
                    for (var pendingMessage of this.pendingMessages) {
                        this.postMessage(pendingMessage.action, pendingMessage.value);
                    }
                    this.pendingMessages = [];
                }
            }
            const msg = new Message(evt.data);
            if(msg.type === 'event' && msg.action === 'zoomend') {
                console.log('Zoom end');
            }

        });
    }
    postMessage(action: string, value: any) {
        const message = new Message();
        message.source = 'api';
        message.type = 'function';
        message.action = action;
        message.value = value;

        if (!this.ready) {
            this.pendingMessages.push(message);
        } else {
            console.log('API- action =', action, message);
            this.iframe.contentWindow.postMessage(JSON.stringify(message), "*");
        }
    }


}
export default Messenger;
