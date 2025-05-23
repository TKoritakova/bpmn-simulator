import { FlowObject } from './FlowObject.js';

/**
 * Representation of an gateway element in a process model. In contrast to the standard bpmn representation, it contains additional data for simulations.
 */
export class Gateway extends FlowObject {
  /**
   * Creates an instance of class Gateway.
   * @param {string} description - description of the Gateway.
   * @param {string} ID - unique text identifier of the Gateway.
   * @param {*} ins - array of incoming ConnectingObjects (IDs).
   * @param {*} outs - array of outgoing ConnectingObjects (IDs).
   * @param {string} type - gateway type (exclusive).
   */
  constructor(description, ID, type, ins, outs) {
    super(description, ID, ins, outs);
    /** @type {string} */
    this.type = type;
    /** @type {*[]} */
    this.probabilities = [];
  }

  /**
   * Gets gateway type. Now supported only exlusive.
   * @returns {string} gateway type
   */
  getType() {
    return this.type;
  }

  /**
   * Adds probability to probability array
   * @param {string} flowID path id
   * @param {number} probability path probability
   */
  addProbability(flowID, probability) {
    this.probabilities.push({id: flowID, probability: probability});
  }

  /**
   * Gets all probabilities.
   * @returns {*[]} probabilites
   */
  getProbabilities() {
    return this.probabilities;
  }

  /**
   * Serializes the contents of a class into a json object.
   * @returns {*} gateway content in json form
   */
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

  /**
   * Deserializes a json object to an gateway class instance.
   * @param {*} data class data in json form
   * @returns {Gateway} instance of class gateway
   */
  static fromSerializableObject(data) {
    const obj = new Gateway(data.description, data.ID, data.typeGateway, data.ins, data.outs);
    obj.probabilities = data.probabilities;
    return obj;
  }
}

