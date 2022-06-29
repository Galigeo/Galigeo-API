export class MapParameters {
    mapId: string;
    location: string;
    devMode: boolean;
}

export class Message {

    constructor(json?: string) {
        if (json) {
            try {
                const obj = JSON.parse(json);
                this.source = obj.source;
                this.type = obj.type;
                this.action = obj.action;
                this.value = obj.value;
            } catch (error) {
                console.error('Failed to parse', json, error);
            }
        }
    }

    source: string;
    type: string;
    action: string;
    value: any;
}