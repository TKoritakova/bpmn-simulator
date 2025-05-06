import { BPMNObject } from "./BPMNObject";


export class DataObject extends BPMNObject {
    constructor(description, ID) {   
        super(description, ID);    
  
    }

    toSerializableObject() {
        return {
          type: 'DataObject',
          description: this.description,
          ID: this.ID
        };
      }
    
      static fromSerializableObject(data) {
        return new DataObject(data.description, data.ID);
      }
  
 
  }
  