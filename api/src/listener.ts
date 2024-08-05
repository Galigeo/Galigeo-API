import { Message } from "./model";

/**
 * @ignore
 */
class Listener {
    
    private _listeners: Map<string, Function[]> = new Map<string, Function[]>();
    private _messages: Function[] = [];

    constructor() {

    }

    addEventListener(event:string, listener:Function) {
        let funcs:Function[] = this._listeners.get(event);
        if(!funcs) {
            funcs = [];
            this._listeners.set(event, funcs);
        }
        funcs.push(listener);
    }
    
    removeEventListner(event:string, listener:Function):boolean {
        let funcs:Function[] = this._listeners.get(event);
        if(!funcs) return false;
        funcs = funcs.filter((e)=>e !== listener);
        return true;
    }
    fireEvent(event:string, value?:any) {
        let funcs:Function[] = this._listeners.get(event);
        if(funcs) {
            for(const f of funcs) {
                f(value);
            }
        }
    }
    
}

export default Listener;