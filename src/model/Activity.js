import { FlowObject } from './FlowObject.js';

/**
 * Representation of an activity element in a process model. In contrast to the standard bpmn representation, it contains additional data and methods for simulations.
 */
export class Activity extends FlowObject {
  /**
   * Creates an instance of class Activity.
   * @param {string} description - description of the activity.
   * @param {string} ID - unique text identifier of the activity.
   * @param {*} ins - array of incoming ConnectingObjects (IDs).
   * @param {*} outs - array of outgoing ConnectingObjects (IDs).
   */
  constructor(description, ID, ins, outs) {
    super(description, ID, ins, outs);
    /** @type {string} */
    this.distribution;
    /** @type {number} */
    this.mean;
    /** @type {number} */
    this.stdDeviation;
    /** @type {string} */
    this.unit;
    /** @type {number} */
    this.fixedCosts;
    /** @type {string} */
    this.resource;
  }


  /**
   * Gets the unit of activity.
   * @returns {string} unit of activity
   */
  getUnit() {
    return this.unit;
  }

  /**
   * Sets a new activity unit value.
   * @param {string} unit unit of activity
   */
  setUnit(unit) {
    this.unit = unit;
  }

  /**
   * Gets standard deviation of activity probability distribution
   * @returns {number} std deviation of activity probability distribution
   */
  getStdDeviation() {
    return this.stdDeviation;
  }

  /**
   * Sets a new value of standard deviation of activity probability distribution.
   * @param {number} stdDeviation std deviation of activity probability distribution
   */
  setStdDeviation(stdDeviation) {
    this.stdDeviation = stdDeviation;
  }

  /**
   * Gets mean of activity probability distribution.
   * @returns {number} mean of activity probability distribution
   */
  getMean() {
    return this.mean;
  }

  /**
   * Sets a new value of mean of activity probability distribution.
   * @param {number} mean mean of activity probability distribution
   */
  setMean(mean) {
    this.mean = mean;
  }

  /**
   * Gets activity distribution type. Supported types: Fixed, Normal, Exponential.
   * @returns {string} activity distribution type
   */
  getDistribution() {
    return this.distribution;
  }

  /**
   * Sets a new value of activity distribution type. Supported types: Fixed, Normal, Exponential.
   * @param {string} distribution activity distributon type.
   */
  setDistribution(distribution) {
    this.distribution = distribution;
  }

  /**
   * Gets fixed costs of activity.
   * @returns {number} fixed costs of activity
   */
  getFixedCosts() {
    return this.fixedCosts;
  }

  /**
   * Sets a new value of fixed costs of activity.
   * @param {number} fixedCosts fixed costs of activity
   */
  setFixedCosts(fixedCosts) {
    this.fixedCosts = fixedCosts;
  }

  /**
 * Gets activity's resource ID.
 * @returns {string} resource ID
 */
  getResource() {
    return this.resource;
  }

  /**
   * Sets a new value of activity's resource ID.
   * @param {string} resource resource ID
   */
  setResource(resource) {
    this.resource = resource;
  }

  /**
   * Serializes the contents of a class into a json object.
   * @returns {*} activity content in json form
   */
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

  /**
   * Deserializes a json object to an activity class instance.
   * @param {*} data class data in json form
   * @returns {Activity} instance of class activity
   */
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
