import { FlowObject } from './FlowObject.js';

export class Activity extends FlowObject {
  
  constructor(description, ID, ins, outs) {
    super(description, ID, ins, outs);
    this.distribution;
    this.mean;
    this.stdDeviation;
    this.unit;
    this.fixedCosts;
    this.resource;
  }

  execute() {
    console.log(`Executing activity ${this.description}`);
  }

  getUnit() {
    return this.unit;
  }

  setUnit(unit) {
    this.unit = unit;
  }

  getStdDeviation() {
    return this.stdDeviation;
  }

  setStdDeviation(stdDeviation) {
    this.stdDeviation = stdDeviation;
  }

  getMean() {
    return this.mean;
  }

  setMean(mean) {
    this.mean = mean;
  }

  getDistribution() {
    return this.distribution;
  }

  setDistribution(distribution) {
    this.distribution = distribution;
  }


  getFixedCosts() {
    return this.fixedCosts;
  }

  setFixedCosts(fixedCosts) {
    this.fixedCosts = fixedCosts;
  }


  getResource() {
    return this.resource;
  }

 
  setResource(resource) {
    this.resource = resource;
  }

  toSerializableObject() {
    return {
      type: 'Activity',
      description: this.description,
      ID: this.ID,
      distribution: this.distribution,
      mean: this.mean,
      stdDeviation: this.stdDeviation,
      unit: this.unit,
      fixedCosts: this.fixedCosts,
      resource: this.resource,
      ins: this.ins.map(obj => obj.getID()),  
      outs: this.outs.map(obj => obj.getID())
    };
  }

  static fromSerializableObject(data) {
    const obj = new Activity(data.description, data.ID, data.ins, data.outs);
    obj.distribution = data.distribution;
    obj.mean = data.mean;
    obj.stdDeviation = data.stdDeviation;
    obj.unit = data.unit;
    obj.fixedCosts = data.fixedCosts;
    obj.resource = data.resource;
    return obj;
  }
}
