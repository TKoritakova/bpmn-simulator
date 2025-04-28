import { Activity } from "../model/Activity";
import random from 'random';

export class WorkItem {
  
  constructor(instanceID, item, readyToBeExecuted) {
    this.instanceID = instanceID;
    this.item = item;
    this.readyToBeExecuted = readyToBeExecuted;
    this.startTime = null;
    this.completedTime = null;
    this.executionTime;
    this.remainingExecutionTime;
    
    if (item instanceof Activity) {
        this.resourceNeeded = item.getResource();
        this.generateExectuionTime();
    } else {
        this.resourceNeeded = null;
    }
    
  }

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

  getRemainingExecutionTime() {
    return this.remainingExecutionTime;
  }

  lowerRemainingExecutionTime() {
    this.remainingExecutionTime -= 1;
  }

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

    setStartTime(time) {
        if (time >= this.readyToBeExecuted) {
            this.startTime = time;
        } else {
            throw new Error(`Start time ${time} of work item: ${this.item.getID()} is greater than ready to be executed time: ${this.readyToBeExecuted}. Cannot process simulation.`);
        }
    }

    setCompletedTime(time) {
        if (this.startTime !== null && time >= this.startTime) {
            this.completedTime = time;
        } else {
            throw new Error(`Cannot set completed time of work item: ${this.item.getID()}: Start time is invalid or greater than completed time. Start time: ${this.startTime}, Attempted completed time: ${time}`);
        }
    }

    getItem() {
        return this.item;
    }

    getReadyToBeExecuted() {
        return this.readyToBeExecuted;
    }

    getStartTime() {
        return this.startTime;
    }

    getCompletedTime() {
        return this.completedTime;
    }

    getResourceNeeded() {
        return this.resourceNeeded;
    }

    getInstanceID() {
        return this.instanceID;
    }

  
}
