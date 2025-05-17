import { FlowObject } from './FlowObject.js';

export class Gateway extends FlowObject {
  constructor(description, ID, type, ins, outs) {
    super(description, ID, ins, outs);
    this.type = type;
    this.probabilities = [];
  }

  getType() {
    return this.type;
  }

  addProbability(flowID, probability) {
    this.probabilities.push({id: flowID, probability: probability});

  }


  getProbabilities() {
    return this.probabilities
  }


  toSerializableObject() {
    return {
      type: 'Gateway',
      description: this.description,
      ID: this.ID,
      typeGateway: this.type,
      probabilities: this.probabilities,
      ins: this.ins.map(obj => obj.getID()),  
      outs: this.outs.map(obj => obj.getID())
    };
  }

  static fromSerializableObject(data) {
    const obj = new Gateway(data.description, data.ID, data.typeGateway, data.ins, data.outs);
    obj.probabilities = data.probabilities;
    return obj;
  }
}