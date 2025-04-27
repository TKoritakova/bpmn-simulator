import { Activity } from "../model/Activity";


export class WorkItem {
  
  constructor(instanceID, item, readyToBeExecuted) {
    this.instanceID = instanceID;
    this.item = item;
    this.readyToBeExecuted = readyToBeExecuted;
    this.startTime = null;
    this.completedTime = null;
    
    if (item instanceof Activity) {
        this.resourceNeeded = item.getResource();
    } else {
        this.resourceNeeded = null;
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
