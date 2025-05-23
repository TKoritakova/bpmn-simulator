import { Activity } from "../model/Activity";
import random from 'random';
import { TimerEvent } from "../model/TimerEvent";
import { MessageEvent } from "../model/MessageEvent";
import { FlowObject } from "../model/FlowObject";

/**
 * Represents an envelope for a bpmn flow object for simulations.
 */
export class WorkItem {
  
  /**
   * Creates instance of class WorkItem.
   * @param {number} instanceID id of instance where object is from
   * @param {FlowObject} item flow object to wrap
   * @param {number} readyToBeExecuted time when element is ready for execution
   */
  constructor(instanceID, item, readyToBeExecuted) {
     /** @type {number} */
    this.instanceID = instanceID;
     /** @type {FlowObject} */
    this.item = item;
     /** @type {number} */
    this.readyToBeExecuted = readyToBeExecuted;
     /** @type {number} */
    this.startTime = null;
     /** @type {number|null} */
    this.completedTime = null;
     /** @type {number|null} */
    this.executionTime;
     /** @type {number|null} */
    this.remainingExecutionTime;
    
    if (item instanceof Activity) {
        /** @type {string|null} */
        this.resourceNeeded = item.getResource();
        this.generateExectuionTime();
    } else if (item instanceof TimerEvent || item instanceof MessageEvent) {
      /** @type {string|null} */
        this.resourceNeeded = null;
        this.startTime = readyToBeExecuted;
        this.generateExectuionTime();
    
    } else {
      /** @type {string|null} */
        this.resourceNeeded = null;
    }
    
  }

  /**
   * Generates execution time based on selected distribution and saves it in attribute.
   */
  generateExectuionTime() {
    let distribution = this.item.getDistribution();
    let generator;
    if (distribution === 'Fixed') {
        generator = random.uniform(this.item.getMean(),this.item.getMean());
    } else if (distribution === 'Normal') {
        generator = random.normal(this.item.getMean(), this.item.getStdDeviation());
    } else if (distribution === 'Exponential') {
        generator = random.exponential(1/this.item.getMean());
    }

    if (generator) {

        this.executionTime = Math.floor(this.convertToSeconds(this.item.getUnit(),Math.abs(generator())));
        this.remainingExecutionTime = this.executionTime;
    }

  }

  /**
   * Gets remaining execution time of element.
   * @returns {number} remaining execution time
   */
  getRemainingExecutionTime() {
    return this.remainingExecutionTime;
  }

  /**
   * Lowers remaining execution time by one.
   */
  lowerRemainingExecutionTime() {
    this.remainingExecutionTime -= 1;
  }

  /**
   * Converts value in unit to seconds
   * @param {string} unit value unite
   * @param {number} value value
   * @returns {number} value in seconds
   * @throws {Error} if the `unit` is not recognized
   */
  convertToSeconds(unit, value) {
    switch (unit.toLowerCase()) {
      case 'second':
      case 'seconds':
        return value;
      case 'minute':
      case 'minutes':
        return value * 60;
      case 'hour':
      case 'hours':
        return value * 3600;
      case 'day':
      case 'days':
        return value * 86400;
      case 'week':
      case 'weeks':
        return value * 604800;
      default:
        throw new Error(`Unknown time unit: ${unit}`);
    }
  }

  /**
   * Sets start time. Must be equal or greater to ready to be executed time.
   * @param {number} time time to set
   * @throws {Error} if the `time` is lower than ready to be executed time.
   */
  setStartTime(time) {
      if (time >= this.readyToBeExecuted) {
          this.startTime = time;
      } else {
          throw new Error(`Start time ${time} of work item: ${this.item.getID()} is greater than ready to be executed time: ${this.readyToBeExecuted}. Cannot process simulation.`);
      }
  }

  /**
   * Sets completed time. Must be equal or greater to start time.
   * @param {number} time time to set
   * @throws {Error} if the `time` is lower than start time.
   */
  setCompletedTime(time) {
      if (this.startTime !== null && time >= this.startTime) {
          this.completedTime = time;
      } else {
          throw new Error(`Cannot set completed time of work item: ${this.item.getID()}: Start time is invalid or greater than completed time. Start time: ${this.startTime}, Attempted completed time: ${time}`);
      }
  }

  /**
   * Gets wrapped item
   * @returns {FlowObject} wrapped item
   */
  getItem() {
      return this.item;
  }

  /**
   * Gets ready to be executed time of work item.
   * @returns {number} ready to be executed time
   */
  getReadyToBeExecuted() {
      return this.readyToBeExecuted;
  }

  /**
   * Gets start time of work item.
   * @returns {number} start time
   */
  getStartTime() {
      return this.startTime;
  }

  /**
   * Gets completed time of work item.
   * @returns {number} completed time
   */
  getCompletedTime() {
      return this.completedTime;
  }

  /**
   * Gets resource needed for work item execution.
   * @returns {string|null} resource needed
   */
  getResourceNeeded() {
      return this.resourceNeeded;
  }

  /**
   * Gets an ID of work item instance.
   * @returns {number} instance ID
   */
  getInstanceID() {
      return this.instanceID;
  }

  /**
   * Gets generated execution time of work item.
   * @returns {number} execution time
   */
  getExecutionTime() {
      return this.executionTime;
  }
  
}
