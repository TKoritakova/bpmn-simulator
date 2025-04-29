import { Event } from './Event.js';

export class TimerEvent extends Event {
  constructor(description, ID, ins, outs, type) {
    super(description, ID, ins, outs, type);
    this.distribution;
    this.mean;
    this.stdDeviation;
    this.unit;
  }

  execute() {
    console.log(`Timer event: ${this.description}`);
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
}