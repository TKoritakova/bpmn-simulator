
/**
 * Abstract base class for all BPMN elements. 
 * Cannot be instantiated directly. Provides basic identification and description functionality.
 */
export class BPMNObject {
  /**
   * Creates an instance of a BPMNObject subclass.
   * Throws an error if instantiated directly.
   * @param {string} description - text description of the object.
   * @param {string} ID - unique identifier of the object.
   */
    constructor(description, ID) {
      if (new.target === BPMNObject) {
        throw new TypeError('Cannot instantiate abstract class BPMNObject directly');
      }
      /** @type {string} */
      this.description = description;
      /** @type {string} */
      this.ID = ID;
    }
  
    /**
    * Gets the description of the BPMN object. In diagram this is label.
    * @returns {string} description of the object
    */
    getDescription() {
      return this.description;
    }

    /**
    * Sets a new value of description for the BPMN object.
    * @param {string} description new description
    */
    setDescription(description) {
      this.description = description;
    }

    /**
    * Gets the unique identifier of the BPMN object.
    * @returns {string} object ID
    */
    getID() {
      return this.ID;
    }

    /**
    * Sets a new value of unique identifier for the BPMN object.
    * @param {string} ID new object ID
    */
    setID(ID) {
      this.ID = ID;
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
    * @returns {BPMNObject} deserialized object instance
    */
    static fromSerializableObject(data) {
      // Abstract method – implementation required in subclass
    }
  
  }