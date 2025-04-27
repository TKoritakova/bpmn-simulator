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
}
