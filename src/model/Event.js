// model/Event.js
import { FlowObject } from './FlowObject.js';

export class Event extends FlowObject {
  constructor(description, ID, ins, outs, type) {
    super(description, ID, ins, outs);
    this.type = type;
  }

  getType() {
    return this.type;
  }

  toSerializableObject() {
    return {
      type: 'Event',
      description: this.description,
      ID: this.ID,
      eventType: this.type,
      ins: this.ins.map(obj => obj.getID()),  
      outs: this.outs.map(obj => obj.getID())
    };
  }

  static fromSerializableObject(data) {
    return new Event(data.description, data.ID, data.ins, data.outs, data.eventType);
  }

}
