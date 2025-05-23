import PriorityQueue from 'js-priority-queue';
import { WorkItem } from './WorkItem';
import { Gateway } from '../model/Gateway';
import { Participant } from '../model/Participant';
import { Event } from '../model/Event';
import { TimerEvent } from '../model/TimerEvent';
import { MessageEvent } from '../model/MessageEvent';
import random from 'random';
import { Activity } from '../model/Activity';
import { BPMNDiagram } from '../model/BPMNDiagram';

/**
 * Representation of the simulation engine.
 */
export class SimulationEngine {
  /**
   * creates an instance of the simulation engine based on the provided process model.
   * @param {BPMNDiagram} diagram model of process
   */
  constructor(diagram) {
    /** @type {number} */
    this.currentTime = 0;
    /** @type {*} */ 
    this.simulatedTime = new Date(diagram.getStartTime()); 
    /** @type {*} */
    this.resourcePools = {}; 
    /** @type {*} */
    this.queueByResourceType = {};  
    /** @type {*[]} */
    this.log = []; 
    /** @type {*} */
    this.startEvent;
    /** @type {*[]} */
    this.arrivals = [];
    /** @type {BPMNDiagram} */
    this.diagram = diagram;
    /** @type {*} */
    this.sleepingItems = new Set();

    this.loadEngineDetailsFromDiagram(diagram);
    
  }
  
  /**
   * Loads participants and start event from process model.
   * @param {BPMNDiagram} diagram model of process
   */
  loadEngineDetailsFromDiagram(diagram) {

    diagram.getAllObjects().forEach(object => {
      if (object instanceof Participant) {
        for (let i = 0; i < object.getNumber(); i++) {
          this.addResource(object,object.getDescription());
        }
      } else if (object instanceof Event && object.getType() == "start" ) {
        this.startEvent = object;
      }
    })
  }

  /**
   * Generates arrival times of each instance.
   * @param {BPMNDiagram} diagram model of process 
   */
  generateArrivalTimes(diagram) {
    let currentGenTime = 0;
    
    let generator;
    if (diagram.getArrivalDistribution() === 'Fixed') {
      generator = random.uniform(diagram.getArrivalMean(),diagram.getArrivalMean());
    } else if (diagram.getArrivalDistribution() === 'Normal') {
      generator = random.normal(diagram.getArrivalMean(), diagram.getArrivalStdDeviation());
    } else if (diagram.getArrivalDistribution() === 'Exponential') {
      generator = random.exponential(1/diagram.getArrivalMean());
    }

    for (let i = 0; i < diagram.getNumberOfInstances(); i++) {
      let interval;   
      if (generator) {
        interval = generator();
        let arrivalInSecs = this.convertToSeconds(diagram.getArrivalUnit(),Math.abs(interval));
        currentGenTime += Math.floor(arrivalInSecs);
        this.arrivals.push({ time: currentGenTime, instanceId: i });
      }    
    }

    this.arrivals.sort();
  }

  /**
   * Converts value to seconds for simulation purposes.
   * @param {string} unit original unit of value
   * @param {number} value value to convert
   * @returns {number} value in seconds
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
   * Adds resource to resource pool.
   * @param {*} resource concrete resource
   * @param {*} resourceType resource type
   */
  addResource(resource, resourceType) {
    if (!this.resourcePools[resourceType]) {
      this.resourcePools[resourceType] = [];
      this.queueByResourceType[resourceType] = new PriorityQueue({comparator: (a, b) => a.priority - b.priority});
    }
    this.resourcePools[resourceType].push(resource); 
  }
  
  /**
   * Adds work item to right queue.
   * @param {FlowObject} item item to be wrapped as work item
   * @param {*} resourceType resource type
   * @param {number} instanceID instance id of item
   */
  addWorkItemToQueue(item, resourceType, instanceID) {   
    if (!this.queueByResourceType[resourceType]) {
        throw new Error(`Queue for resource type '${resourceType}' does not exist.`);
    }
  
    let workItem = new WorkItem(instanceID, item, this.currentTime);
    this.queueByResourceType[resourceType].queue({ task: workItem, priority: instanceID });
  }
  
  /**
   * The simulation loop of the simulation engine. The main method of this class.
   */ 
  async run() {
    this.generateArrivalTimes(this.diagram);
    while ((this.hasTasks() || this.sleepingItems.size > 0 || this.arrivals.length > 0)) {
      // LAUNCHING NEW INSTANCES
      while (this.arrivals.length > 0 && this.currentTime >= this.arrivals[0].time) {
        const arrival = this.arrivals.shift(); 
        let workItem = this.logEvent(this.startEvent,arrival.instanceId+1);
        this.handleTokenMovement(workItem);
      }

      // SHIFT OF SLEEPING ITEMS
      for (const item of this.sleepingItems) {
        if(item.resource === "none" || this.isResourceCurrentlyWorking(item.resource)) {
          item.task.lowerRemainingExecutionTime();

          // RELEASED SOURCE AND COMPLETED
          if (item.task.getRemainingExecutionTime() < 1) {
            if (item.resource != "none") {
              this.resourcePools[item.resource.getDescription()].push(item.resource);
            }          
            this.endTask(item.task);
            this.sleepingItems.delete(item);
          }
        }          
      }

      // QUEUES       
      for (let resourceType in this.queueByResourceType) {
        const queue = this.queueByResourceType[resourceType];
        const availableResources = this.resourcePools[resourceType];
        if(availableResources.length > 0 && this.isResourceCurrentlyWorking(availableResources[0])) {
          while (availableResources.length > 0 && queue.length > 0) {            
            const resource = availableResources.shift();
            const taskWrapper = queue.dequeue();
            const task = taskWrapper.task;
            task.setStartTime(this.currentTime);
            this.sleepingItems.add({task: task, resource: resource});    
          }
        }         
      }
      this.currentTime += 1;
      this.simulatedTime.setSeconds(this.simulatedTime.getSeconds() + 1)
    }
  }
  
  /**
   * Decides if resource is currently working.
   * @param {*} resource resource
   * @returns {boolean} true if resource is working
   */
  isResourceCurrentlyWorking(resource){    
    let timetableName = resource.getWorkingHours();
    let timetable = this.diagram.getTimetableByName(timetableName);

    let day = this.simulatedTime.getDay(); 
    if (day == 0) {
      day = 7;
    }
    
    let startDay = timetable.getBeginDay() == 0 ? 7: timetable.getBeginDay();
    let endDay = timetable.getEndDay() == 0 ? 7 : timetable.getEndDay();
    let isWorkday = day >= startDay && day <= endDay;
    if (isWorkday) {     
      let hour = this.simulatedTime.getHours();
      let minute = this.simulatedTime.getMinutes();

      let beginTime = timetable.getBeginTime().split(':');
      let endTime = timetable.getEndTime().split(':');

      if ((hour > beginTime[0] || (hour == beginTime[0] && minute >= beginTime[1])) && (hour < endTime[0] || (hour == endTime[0]  && minute <= endTime[1]))) {
        return true;
      }
    }

    return false; 
  }
    
  /**
   * Determines whether any queue has work items in it.
   * @returns {boolean} true if any queue has tasks
   */
  hasTasks() {
    for (let resourceType in this.queueByResourceType) {
      if (this.queueByResourceType[resourceType].length > 0) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Ends task.
   * @param {*} task task to be ended
   */
  endTask(task) {
    task.setCompletedTime(this.currentTime);
    this.log.push(task);   
    this.handleTokenMovement(task);
  }

  /**
   * Handles token movement - determines which element should be executed after the currenct one, which is given to method as parameter.
   * @param {*} task ending task
   */
  handleTokenMovement(task) {    
    let item = task.getItem();
    let descendants = [];
    
    if (Array.isArray(item.getOuts()) && item.getOuts().length > 0)  {
      item.getOuts().forEach(element => {   
          descendants.push(element.target); 
      })
    }

    while (descendants.length > 0) {
      let descendant = descendants.shift();
      if (descendant instanceof Activity) {
        this.addWorkItemToQueue(descendant, descendant.getResource(), task.getInstanceID());
      } else if (descendant instanceof TimerEvent || descendant instanceof MessageEvent) {
        let workItem = new WorkItem(task.getInstanceID(), descendant, this.currentTime);
        this.sleepingItems.add({task: workItem, resource: "none"})   
      } else if (descendant instanceof Gateway) {
        //handle gateway
        if (Array.isArray(descendant.getOuts()) && descendant.getOuts().length > 0) {
          let selectedID = this.weightedRandomSelect(descendant.getProbabilities());
          let selectedConnectingElement = descendant.getOuts().find(element => element.getID() === selectedID);          
          if (selectedConnectingElement) {
            descendants.push(selectedConnectingElement.target);
          }          
        }
      } else if (descendant instanceof Event) {
        if (Array.isArray(descendant.getOuts()) && descendant.getOuts().length > 0)  {
          descendant.getOuts().forEach(element => {   
              descendants.push(element.target); 
          })
        }
        this.logEvent(descendant, task.getInstanceID());
      }
    }  
  }

  /**
   * Prepares event for logging.
   * @param {*} event event
   * @param {*} instanceID instance id
   * @returns wrapped event for logging
   */
  logEvent(event, instanceID) {
    let workItemToLog = new WorkItem(instanceID,event,this.currentTime);
    workItemToLog.setStartTime(this.currentTime);
    workItemToLog.setCompletedTime(this.currentTime);
    this.log.push(workItemToLog);

    return(workItemToLog);
  }

  /**
   * Randomly selects path that the exclusive gateway will run based on probabilities.
   * @param {*} choices path choices
   * @returns {*} selected path
   */
  weightedRandomSelect(choices) {
    if(choices.length > 0) {
      let totalProbability = choices.reduce((sum, choice) => sum + choice.probability, 0);
      let generator = random.uniform(0,totalProbability);
      let randomNumber = generator();
    
      for (const choice of choices) {
          if (randomNumber < choice.probability) {
              return choice.id;
          }
          randomNumber -= choice.weight;
      }
      return choices.at(-1).id;
    }
  }  
}
  