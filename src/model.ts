import Layer from "./layer";

/**
 * This file is used to store various POJO
 */
export class MapParameters {
    /**
     * Legacy parameter for mapId
     */
    id: string; 
    mapId: string;
    url: string;
    devMode: boolean;
    crossDomain: boolean;
    data: any[];
}

export class Message {

    constructor(json?: string) {
        if (json) {
            try {
                const obj = JSON.parse(json);
                this.id = obj.id;
                this.source = obj.source;
                this.type = obj.type;
                this.action = obj.action;
                this.value = obj.value;
                if(obj.layer) {
                    this.layer = new Layer(obj.layer.id, {name: obj.layer.name});
                }
            } catch (error) {
                console.debug('Skip message', json, error);
            }
        }
    }

    source: string;
    type: string;
    action: string;
    value: any;
    layer: Layer;
    id: string;
    resolve: Function;
}

