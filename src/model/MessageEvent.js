import { Event } from './Event.js';

/**
 * Representation of an message event element in a process model.
 */
export class MessageEvent extends Event {
  /**
   * Creates an instance of class Event.
   * @param {string} description - description of the event.
   * @param {string} ID - unique text identifier of the event.
   * @param {*} ins - array of incoming ConnectingObjects (IDs).
   * @param {*} outs - array of outgoing ConnectingObjects (IDs).
   * @param {string} type - event type. Possible value - start, end, intermediate.
   */
  constructor(description, ID, ins, outs, type) {
    super(description, ID, ins, outs, type);
    /** @type {string} */
    this.distribution;
    /** @type {number} */
    this.mean;
    /** @type {number} */
    this.stdDeviation;
    /** @type {string} */
    this.unit;
  }

  /**
   * Gets the unit of event.
   * @returns {string} unit of event
   */
  getUnit() {
    return this.unit;
  }

  /**
   * Sets a new event unit value.
   * @param {string} unit unit of event
   */
  setUnit(unit) {
    this.unit = unit;
  }

  /**
   * Gets standard deviation of event probability distribution
   * @returns {number} std deviation of event probability distribution
   */
  getStdDeviation() {
    return this.stdDeviation;
  }

  /**
   * Sets a new value of standard deviation of event probability distribution.
   * @param {number} stdDeviation std deviation of event probability distribution
   */
  setStdDeviation(stdDeviation) {
    this.stdDeviation = stdDeviation;
  }

  /**
   * Gets mean of event probability distribution.
   * @returns {number} mean of event probability distribution
   */
  getMean() {
    return this.mean;
  }

  /**
   * Sets a new value of mean of event probability distribution.
   * @param {number} mean mean of event probability distribution
   */
  setMean(mean) {
    this.mean = mean;
  }

  /**
   * Gets event distribution type. Supported types: Fixed, Normal, Exponential.
   * @returns {string} event distribution type
   */
  getDistribution() {
    return this.distribution;
  }

  /**
   * Sets a new value of event distribution type. Supported types: Fixed, Normal, Exponential.
   * @param {string} distribution event distributon type.
   */
  setDistribution(distribution) {
    this.distribution = distribution;
  }

  /**
   * Serializes the contents of a class into a json object.
   * @returns {*} event content in json form
   */
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

  /**
   * Deserializes a json object to an event class instance.
   * @param {*} data class data in json form
   * @returns {MessageEvent} instance of class event
   */
  static fromSerializableObject(data) {
    const obj = new MessageEvent(data.description, data.ID, data.ins, data.outs, data.eventType);
    obj.distribution = data.distribution;
    obj.mean = data.mean;
    obj.stdDeviation = data.stdDeviation;
    obj.unit = data.unit;
    return obj;
  }
}