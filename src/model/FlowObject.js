import { BPMNObject } from "./BPMNObject";


export class FlowObject extends BPMNObject {
    constructor(description, ID, ins, outs) {
      if (new.target === FlowObject) {
        throw new TypeError('Cannot instantiate abstract class FlowObject directly');
      }
      super(description, ID);    
      this.duration = null;
      this.ins = ins;
      this.outs = outs;
    }
  
    execute() {
      throw new Error('Method "execute()" must be implemented in subclass');
    }

    setDuration(duration) {
      this.duration = duration;
    }

    getDuration() {
      return this.duration;
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
  }
  