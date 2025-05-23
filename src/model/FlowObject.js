import { BPMNObject } from "./BPMNObject";

/**
 * Abstract base class for all flow elements. 
 * Cannot be instantiated directly.
 */
export class FlowObject extends BPMNObject {
  /**
   * Creates an instance of a FlowObject subclass.
   * Throws an error if instantiated directly.
   * @param {string} description - description of the FlowObject.
   * @param {string} ID - unique text identifier of the FlowObject.
   * @param {*} ins - array of incoming ConnectingObjects (IDs).
   * @param {*} outs - array of outgoing ConnectingObjects (IDs).
   */
  constructor(description, ID, ins, outs) {
    if (new.target === FlowObject) {
      throw new TypeError('Cannot instantiate abstract class FlowObject directly');
    }
    super(description, ID); 
    /** @type {*} */   
    this.ins = ins;
    /** @type {*} */
    this.outs = outs;
  }

  /**
   * Sets new array of incoming conncenting objects.
   * @param {*[]} ins new array of incoming conncenting objects
   */
  setIns(ins) {
    this.ins = ins;
  }

  /**
   * Gets array of incoming conncenting objects.
   * @returns {*[]} array of incoming conncenting objects
   */
  getIns() {
    return this.ins;
  }

  /**
   * Sets new array of outgoing conncenting objects.
   * @param {*[]} outs new array of outgoing conncenting objects
   */
  setOuts(outs) {
    this.outs = outs;
  }

  /**
   * Gets new array of outgoing conncenting objects.
   * @returns {*[]} array of outgoin conncenting objects
   */
  getOuts() {
    return this.outs;
  }

  
  /**
  * Serializes the object to a JSON-compatible format.
  * Should be implemented by subclasses.
  * @abstract
  * @returns {*} serialized representation of the object
  */
  toSerializableObject() {
    // Abstract method – implementation required in subclass
  }

  /**
  * Deserializes a JSON-compatible object into a BPMNObject subclass instance.
  * Should be implemented by subclasses.
  * @abstract
  * @param {*} data serialized object data
  * @returns {FlowObject} deserialized object instance
  */
  static fromSerializableObject(data) {
    // Abstract method – implementation required in subclass
  }
}

  