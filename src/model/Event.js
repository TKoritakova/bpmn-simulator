// model/Event.js
import { FlowObject } from './FlowObject.js';

export class Event extends FlowObject {
  constructor(description, duration, ID) {
    super(description, duration, ID);
  }

  execute() {
    console.log(`Event triggered: ${this.description}`);
  }
}
