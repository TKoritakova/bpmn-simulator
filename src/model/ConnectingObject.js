import { BPMNObject } from "./BPMNObject";


export class ConnectingObject extends BPMNObject {
    constructor(description, ID, type, source, target) {   
        super(description, ID);    
        this.type = type;
        this.source = source;
        this.target = target;
    }
  
    getType() {
        return this.type;
    }

    getSource() {
        return this.source;
    }

    setSource(source) {
        this.source = source;
    }

    getTarget() {
        return this.target;
    }

    setTarget(target) {
        this.target = target;
    }
  }
  