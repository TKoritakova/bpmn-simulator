import { Event } from './Event.js';

export class MessageEvent extends Event {
  constructor(description, ID, ins, outs, type) {
    super(description, ID, ins, outs, type);
    this.distribution;
    this.mean;
    this.stdDeviation;
    this.unit;
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

  toSerializableObject() {
    return {
      type: 'MessageEvent',
      description: this.description,
      ID: this.ID,
      eventType: this.type,
      distribution: this.distribution,
      mean: this.mean,
      stdDeviation: this.stdDeviation,
      unit: this.unit,
      ins: this.ins.map(obj => obj.getID()),  
      outs: this.outs.map(obj => obj.getID())
    };
  }

  static fromSerializableObject(data) {
    const obj = new MessageEvent(data.description, data.ID, data.ins, data.outs, data.eventType);
    obj.distribution = data.distribution;
    obj.mean = data.mean;
    obj.stdDeviation = data.stdDeviation;
    obj.unit = data.unit;
    return obj;
  }
}