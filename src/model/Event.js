// model/Event.js
import { FlowObject } from './FlowObject.js';

/**
 * Representation of an event element in a process model.
 */
export class Event extends FlowObject {
  /**
   * Creates an instance of class Event.
   * @param {string} description - description of the Event.
   * @param {string} ID - unique text identifier of the Event.
   * @param {*} ins - array of incoming ConnectingObjects (IDs).
   * @param {*} outs - array of outgoing ConnectingObjects (IDs).
   * @param {string} type - event type. Possible value - start, end, intermediate.
   */
  constructor(description, ID, ins, outs, type) {
    super(description, ID, ins, outs);
    /** @type {string} */
    this.type = type;
  }

  /**
   * Get event type. Possible values - start, end, intermediate.
   * @returns {string} event type
   */
  getType() {
    return this.type;
  }

  /**
   * Serializes the contents of a class into a json object.
   * @returns {*} event content in json form
   */
  toSerializableObject() {
    return {
      type: 'Event',
      description: this.description,
      ID: this.ID,
      eventType: this.type,
      ins: this.ins.map(obj => obj.getID()),  
      outs: this.outs.map(obj => obj.getID())
    };
  }

  /**
   * Deserializes a json object to an event class instance.
   * @param {*} data class data in json form
   * @returns {Event} instance of class event
   */
  static fromSerializableObject(data) {
    return new Event(data.description, data.ID, data.ins, data.outs, data.eventType);
  }

}
