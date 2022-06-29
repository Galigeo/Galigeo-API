import Messenger from "./messenger";

class Layer {
    private id: string;
    private name: string;
    private messenger: Messenger;

    constructor(id: string, name: string, messenger: Messenger) {
        this.id = id;
        this.name = name;
    }

    getId():String {
        return this.id;
    }

    getName():String {
        return this.name;
    }
}

export default Layer