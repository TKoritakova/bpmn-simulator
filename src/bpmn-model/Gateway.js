import { FlowObject } from './FlowObject.js';

export class Gateway extends FlowObject {
  constructor(description, duration, ID, type) {
    super(description, duration, ID);
    this.type = type;
  }

  execute() {
    console.log(`Gateway (${this.type}): ${this.description}`);
  }
}