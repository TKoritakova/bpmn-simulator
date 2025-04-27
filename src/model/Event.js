// model/Event.js
import { FlowObject } from './FlowObject.js';

export class Event extends FlowObject {
  constructor(description, ID, ins, outs, type) {
    super(description, ID, ins, outs);
    this.type = type;
  }

  execute() {
    console.log(`Event triggered: ${this.description}`);
  }

  getType() {
    return this.type;
  }
}
