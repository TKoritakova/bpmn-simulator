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

    toSerializableObject() {
        return {
          type: 'ConnectingObject',
          description: this.description,
          ID: this.ID,
          source: this.source.getID(),
          target: this.target.getID(),
          connectionType: this.type
        };
      }
    
      static fromSerializableObject(data) {
        return new ConnectingObject(data.description, data.ID, data.connectionType, data.source, data.target);
      }
  }
  