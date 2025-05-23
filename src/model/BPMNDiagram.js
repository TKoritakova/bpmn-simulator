import { BPMNObject } from "./BPMNObject";
import { Timetable } from "./Timetable";
import { deserializeBPMNObject } from "../bpmn-parsing/BPMNObjectFactory";
import { BPMNAssembler } from '../bpmn-parsing/BPMNAssembler.js';
import { FlowObject } from '../model/FlowObject.js';
import { ConnectingObject } from '../model/ConnectingObject.js';

/**
 * Representation of BPMN diagram model. Contains process elements, timetables and input parameters for simulation scenarios.
 */
export class BPMNDiagram {
  /**
   * Creates an instance of class BPMNDiagram.
   */
  constructor() {
    /** @type {*} */
    this.objects = [];
    /** @type {string} */
    this.arrivalDistribution;
    /** @type {number} */
    this.arrivalMean;
    /** @type {number} */
    this.arrivalStdDeviation;
    /** @type {string} */
    this.arrivalUnit;
    /** @type {number} */
    this.numberOfInstances;
    /** @type {*} */
    this.startTime;
    /** @type {string} */
    this.currency;
    /** @type {*} */
    this.timetables = [];
  }

  /**
   * Adds a BPMNObject to the diagram.
   * @param {BPMNObject} obj BPMN object to add
   */
  addObject(obj) {
    if (obj instanceof BPMNObject) {
      this.objects.push(obj); 
    } else {
      console.log("Cannot add this object to diagram: " + obj);
    }
  }

  /**
   * Returns all BPMNObjects in the diagram.
   * @returns {BPMNObject[]} all BPMN objects in diagram
   */
  getAllObjects() {
    return this.objects;
  }

  /**
   * Finds an BPMNObject by its ID.
   * @param {string} id object ID
   * @returns {BPMNObject|null} BPMN object or null
   */
  getObjectByID(id) {
    return this.objects.find(obj => obj.getID() == id) || null;
  }

  /**
   * Finds an BPMNObject by its description. If multiple, returns first.
   * @param {string} description object description
   * @returns {BPMNObject|null} BPMN object or null
   */
  getObjectByDescription(description) {
    return this.objects.find(obj => obj.getDescription() == description) || null;
  }

  /**
   * Adds a Timetable to the diagram.
   * @param {Timetable} timetable timetable to add
   */
  addTimetable(timetable) {
    if (timetable instanceof Timetable) {
      this.timetables.push(timetable);
    }
  }

  /**
   * Returns all timetables assigned to diagram.
   * @returns {Timetable[]} all timetables
   */
  getAllTimetables() {
    return this.timetables;
  }

  /**
   * Finds a timetable by its name.
   * @param {string} name timetable name
   * @returns {Timetable|null} timetable or null
   */
  getTimetableByName(name) {
    return this.timetables.find(table => table.getName() == name) || null;
  }

  /**
   * Sets a new value of diagram's arrival distribution type. Supported types: Fixed, Normal, Exponential.
   * @param {string} arrivalDistribution arrival distribution type
   */
  setArrivalDistribution(arrivalDistribution) {
    this.arrivalDistribution = arrivalDistribution;
  }
  
  /**
   * Sets a new value of diagram's arrival distribution mean
   * @param {number} arrivalMean arrival distribution mean
   */
  setArrivalMean(arrivalMean) {
    this.arrivalMean = arrivalMean;
  }
  
  /**
   * Sets a new value of diagram's arrival distribution standard deviation.
   * @param {number} arrivalStdDeviation arrival distribution standard deviation
   */
  setArrivalStdDeviation(arrivalStdDeviation) {
    this.arrivalStdDeviation = arrivalStdDeviation;
  }
  
  /**
   * Sets a new value of diagram's arrival unit.
   * @param {string} arrivalUnit arrival unit
   */
  setArrivalUnit(arrivalUnit) {
    this.arrivalUnit = arrivalUnit;
  }
  
  /**
   * Sets a new value of diagram's number of instances.
   * @param {number} numberOfInstances number of instances.
   */
  setNumberOfInstances(numberOfInstances) {
    this.numberOfInstances = numberOfInstances;
  }
  
  /**
   * Sets a new value of diagram's start time of simulation.
   * @param {*} startTime start time of simulation
   */
  setStartTime(startTime) {
    this.startTime = startTime;
  }
  
  /**
   * Sets a new value of diagram's currency.
   * @param {string} currency currency
   */
  setCurrency(currency) {
    this.currency = currency;
  }

  /**
   * Gets value of diagram's arrival distribution type. Supported types: Fixed, Normal, Exponential.
   * @returns {string} arrival distribution type
   */
  getArrivalDistribution() {
    return this.arrivalDistribution;
  }
  
  /**
   * Gets value of diagram's arrival mean.
   * @returns {number} arrival mean
   */
  getArrivalMean() {
    return this.arrivalMean;
  }
  
  /**
   * Gets value of diagram's arrival standard deviation.
   * @returns {number} arrival std deviation
   */
  getArrivalStdDeviation() {
    return this.arrivalStdDeviation;
  }
  
  /**
   * Gets value of diagram's arrival unit
   * @returns {string} arrival unit
   */
  getArrivalUnit() {
    return this.arrivalUnit;
  }
  
  /**
   * Gets value of diagram's number of simulation instances.
   * @returns {number} number of simulation instances
   */
  getNumberOfInstances() {
    return this.numberOfInstances;
  }
  
  /**
   * Gets value of diagram's simulation start time.
   * @returns {*} simulation start time
   */
  getStartTime() {
    return this.startTime;
  }
  
  /**
   * Gets value of diagram's simulation currency.
   * @returns {string} simulation currency
   */
  getCurrency() {
    return this.currency;
  }


  /**
   * Serializes the contents of a class into a json object.
   * @returns {*} diagram content in json
   */
  toSerializableObject() {
    return {
      arrivalDistribution: this.arrivalDistribution,
      arrivalMean: this.arrivalMean,
      arrivalStdDeviation: this.arrivalStdDeviation,
      arrivalUnit: this.arrivalUnit,
      numberOfInstances: this.numberOfInstances,
      startTime: this.startTime?.toISOString?.() || this.startTime,
      currency: this.currency,
      timetables: this.timetables.map(t => t.toSerializableObject()),
      objects: this.objects.map(o => o.toSerializableObject())
    };
  }

  /**
   * Deserializes a json object to an activity class instance.
   * @param {*} data class data in json form
   * @returns {BPMNDiagram} instance of class BPMNDiagram
   */
  static fromSerializableObject(data) {
    const d = new BPMNDiagram();
    d.setArrivalDistribution(data.arrivalDistribution);
    d.setArrivalMean(data.arrivalMean);
    d.setArrivalStdDeviation(data.arrivalStdDeviation);
    d.setArrivalUnit(data.arrivalUnit);
    d.setNumberOfInstances(data.numberOfInstances);
    d.setStartTime(new Date(data.startTime));
    d.setCurrency(data.currency);
    data.timetables.forEach(t => d.addTimetable(Timetable.fromSerializableObject(t)));
    data.objects.forEach(o => d.addObject(deserializeBPMNObject(o)));
    return d;
  }

  /**
   * Creates copy of diagram using serialization and deserialization.
   * @returns {BPMNDiagram} instance of class BPMNDiagram
   */
  createCopyForSimulation() {
    const newDiagram = BPMNDiagram.fromSerializableObject(this.toSerializableObject());
    newDiagram.getAllObjects().forEach(element => {
      /* ADD MESSAGE CONNECTIONS */
      if (element instanceof ConnectingObject && element.getType() === 'message') {
          BPMNAssembler.addMessageConnections(newDiagram, element);
      }

      /* ADD REFERENCES */
      if (element instanceof FlowObject) {
          BPMNAssembler.createReferenceConnectionsFlowObj(newDiagram, element);

      } else if (element instanceof ConnectingObject) {
          BPMNAssembler.createReferenceConnectionsConnectingObj(newDiagram, element);
      } 
      
  });
  return newDiagram;
  }   
}
  