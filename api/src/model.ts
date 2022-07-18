import Layer from "./layer";

/**
 * This file is used to store various POJO
 */
export class MapParameters {
    /**
     * Legacy parameter for mapId
     */
    public id: string;
    /**
     * This ID is used to identify the map.
     * 
     */
    public mapId: string;
    /**
     * URL of Galigeo. When not defined, the url
     * is https://go.galigeo.com
     */
    public url: string;
    /**
     * For internal use only
     */
    public devMode: boolean;
    /**
     * Set crossdomain=true when the map
     * is sandboxed.
     */
    public crossDomain: boolean;
    /**
     * An array of data that will be loaded
     * dynamically with map. Two types of data are supported:
     * - inline json features
     * - link to a csv file
     * Please see our sample page for more details how to specify the data
     */
    public data: any[];
}
export class Style {
    fillColor: string;
    color: string;
    fillOpacity: number;
    radius: number;
    weight: number;
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
                if (obj.layer) {
                    this.layer = new Layer(obj.layer.id, { name: obj.layer.name });
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

