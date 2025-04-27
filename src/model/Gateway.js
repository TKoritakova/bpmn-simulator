import { FlowObject } from './FlowObject.js';

export class Gateway extends FlowObject {
  constructor(description, ID, type, ins, outs) {
    super(description, ID, ins, outs);
    this.type = type;
    this.probabilities = {};
  }

  execute() {
    console.log(`Gateway (${this.type}): ${this}`);
  }

  getType() {
    return this.type;
  }

  addProbability(flowID, probability) {
    this.probabilities[flowID] = probability;
  }

  getProbabilityByID(id) {
    return this.probabilities.hasOwnProperty(id) ? probabilities[id] : null;
  }
}