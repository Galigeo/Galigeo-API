abstract class Messenger {
    
    iframe: HTMLIFrameElement;
    
    constructor() {

    }

    protected postMessage(action: string, value:any) {
        const message = new Message();
        message.source = 'api';
        message.type = 'function';
        message.action =  action;
        message.value = value;

        this.iframe.contentWindow.postMessage(JSON.stringify, "*");
    }
}
