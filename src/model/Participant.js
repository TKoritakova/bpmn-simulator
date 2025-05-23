import { BPMNObject } from "./BPMNObject";

/**
 * Representation of pool or lane element in a process model
 */
export class Participant extends BPMNObject {
    /**
     * Creates an instance of class Participant.
     * @param {string} description - description of the Participant.
     * @param {string} ID - unique text identifier of the Participant.
     */
    constructor(description, ID) {   
        super(description, ID); 
        /** @type {number} */
        this.cost;
        /** @type {string} */
        this.workingHours;
        /** @type {number} */
        this.number;
    }

    /**
     * Gets hourly costs of resource in simulation currency.
     * @returns {number} costs of resource
     */
    getCost() {
        return this.cost;
    }

    /**
     * Sets new hourly costs of resource in simulation currency.
     * @param {number} value new costs
     */
    setCost(value) {
    this.cost = value;
    }

    /**
     * Gets name of timetable for resource working hours.
     * @returns {string} nambe of timetable
     */
    getWorkingHours() {
    return this.workingHours;
    }

    /**
     * Sets new name of timetable for resource working hours.
     * @param {string} value new name of timetable
     */
    setWorkingHours(value) {
    this.workingHours = value;
    }
  
    /**
     * Sets resource capacity.
     * @param {number} number new capacity
     */
    setNumber(number) {
        this.number = number;
    }
    
    /**
     * Gets reousrce capacity.
     * @returns {number} capacity
     */
    getNumber() {
        return this.number;
    } 

    /**
   * Serializes the contents of a class into a json object.
   * @returns {*} participant content in json form
   */
    toSerializableObject() {
        return {
          type: 'Participant',
          description: this.description,
          ID: this.ID,
          cost: this.cost,
          workingHours: this.workingHours,
          number: this.number
        };
    }
    
    /**
   * Deserializes a json object to an Participant class instance.
   * @param {*} data class data in json form
   * @returns {Participant} instance of class Participant
   */
    static fromSerializableObject(data) {
        const obj = new Participant(data.description, data.ID);
        obj.cost = data.cost;
        obj.workingHours = data.workingHours;
        obj.number = data.number;
        return obj;
    }
  }

  
  