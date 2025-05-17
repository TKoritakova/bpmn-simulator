import { BPMNObject } from "./BPMNObject";


export class FlowObject extends BPMNObject {
    constructor(description, ID, ins, outs) {
      if (new.target === FlowObject) {
        throw new TypeError('Cannot instantiate abstract class FlowObject directly');
      }
      super(description, ID);    
      this.ins = ins;
      this.outs = outs;
    }


    setIns(ins) {
      this.ins = ins;
    }

    getIns() {
      return this.ins;
    }

    setOuts(outs) {
      this.outs = outs;
    }

    getOuts() {
      return this.outs;
    }

    toSerializableObject() {
      
    }
  
    static fromSerializableObject(data) {

    }
  }

  