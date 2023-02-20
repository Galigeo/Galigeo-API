import Layer from "./layer";

/**
 * MapParameters defines all the properties of the map (name, rights, data, etc..).
 * Only the name is mandatory.
 * 
 */
export class MapParameters {
    /**
     * Legacy parameter for mapId (please do not use)
     * @ignore
     */
    public id: string;
    /**
     * This ID is used to identify the map. When this property is
     * not defined, then the ID is generated based on the name of
     * the map.
     * 
     */
    public mapId: string;
    /**
     * Name of the map. If a name is specified but not
     * a mapId, then the mapId is generated from the name.
     */
    public name: string;
    /**
     * Optionally specify the language.
     * By default the browser language is used
     */
    public lang: string;
    /**
     * URL of Galigeo. When not defined, the url
     * is https://showcase.galigeo.com
     */
    public url: string;
    /**
     * For internal use only
     * @ignore
     */
    public devMode: boolean;
    /**
     * Set crossdomain=true when the map
     * is sandboxed (optional).
     */
    public crossDomain: boolean;
    /**
     * An array of data that will be loaded
     * dynamically with map (optional). 
     * Two types of data are supported:
     * - inline json features
     * - link to a csv file
     * Please see our sample page for more details how to specify the data
     */
    public data: any[];
    /**
     * Used to force the user profile (optional).
     * Default profiles are Viewer, Explorer, Creator and Designer. It is possible
     * to add custom profiles in the user management of the Galigeo admin page.
     */
    public profile: string;
    /**
     * Used to force the username (optional).
     * If the username is not defined, then currently logged used will be used. This is
     * done by checking the cookie "GaligeoToken". If no active session is detected and the
     * user property is not defined, then the default value is anonymous.
     */
    public user: string;

    /**
     * You can get the api key from the licence page of Galigeo. A valid API
     * key is required to get a map instance.
     */
    public apiKey: string;

    /**
     * When true, redirect to the map url instead of using
     * an iframe (optional, default=false).
     * This option is useful in some specific sandbox environment where
     * the creation of an iframe is forbidden.
     */
    public redirect: boolean;

    
}
/**
 * Define the style for a map feature
 * ex: 
      style: {
        fillColor: "#74D76F",
        color: "#74D76F",
        fillOpacity: 1,
        radius: 8,
        weight: 1
      }
 */
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

