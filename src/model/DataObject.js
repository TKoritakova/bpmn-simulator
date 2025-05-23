import { BPMNObject } from "./BPMNObject";

/**
 * Representation of an data element in a process model.
 */
export class DataObject extends BPMNObject {
  /**
   * Creates an instance of class DataObject.
   * @param {string} description - description of the DataObject.
   * @param {string} ID - unique text identifier of the DataObject.
   */
  constructor(description, ID) {   
    super(description, ID);    
  }

  /**
   * Serializes the contents of a class into a json object.
   * @returns {*} DataObject content in json form
   */
  toSerializableObject() {
    return {
      type: 'DataObject',
      description: this.description,
      ID: this.ID
    };
  }
  
  /**
   * Deserializes a json object to DataObject class instance.
   * @param {*} data class data in json form
   * @returns {DataObject} instance of class DataObject
   */
  static fromSerializableObject(data) {
    return new DataObject(data.description, data.ID);
  }
  
}
  