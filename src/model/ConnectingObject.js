import { BPMNObject } from "./BPMNObject";

/**
 * Representation of an connecting element in a process model. (e.g., sequence flow, message flow).
 * Inherits from BPMNObject and adds source, target and type of connection.
 */
export class ConnectingObject extends BPMNObject {
    /**
    * Creates an instance of class ConnectingObject.
    * @param {string} description - description of the connecting object.
    * @param {string} ID - unique text identifier of the connecting object.
    * @param {string} type - type of connection (sequence, message).
    * @param {BPMNObject|string} source - source object or source ID.
    * @param {BPMNObject|string} target - target object or target ID.
    */
    constructor(description, ID, type, source, target) {   
        super(description, ID);    
        /** @type {string} */
        this.type = type;
        /** @type {BPMNObject|string} */
        this.source = source;
        /** @type {BPMNObject|string} */
        this.target = target;
    }
  
    /**
     * Gets type of connection - message, sequence.
     * @returns {string} connection type
     */
    getType() {
        return this.type;
    }

    /**
     * Gets source of connecting object.
     * @returns {BPMNObject|string} source
     */
    getSource() {
        return this.source;
    }

    /**
     * Sets a new value of object source.
     * @param {BPMNObject|string} source new object source
     */
    setSource(source) {
        this.source = source;
    }

    /**
     * Gets target of connecting object.
     * @returns {BPMNObject|string} target
     */
    getTarget() {
        return this.target;
    }

    /**
     * Sets a new value of object target.
     * @param {BPMNObject|string} target new object target
     */
    setTarget(target) {
        this.target = target;
    }

    /**
   * Serializes the contents of a class into a json object.
   * @returns {*} connecting object content in json form
   */
    toSerializableObject() {
        return {
          type: 'ConnectingObject',
          description: this.description,
          ID: this.ID,
          source: this.source.getID(),
          target: this.target.getID(),
          connectionType: this.type
        };
    }
        
    /**
   * Deserializes a json object to an ConnectingObject class instance.
   * @param {*} data class data in json form
   * @returns {ConnectingObject} instance of class ConnectingObject
   */
    static fromSerializableObject(data) {
        return new ConnectingObject(data.description, data.ID, data.connectionType, data.source, data.target);
    }
}
  