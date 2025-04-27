import PriorityQueue from 'js-priority-queue';
import { WorkItem } from './WorkItem';
import { Gateway } from '../model/Gateway';
import { Participant } from '../model/Participant';
import { Event } from '../model/Event';
import random from 'random';

export class SimulationEngine {
    constructor(diagram) {
      this.currentTime = 0;  
      this.resourcePools = {}; 
      this.queueByResourceType = {};  
      this.log = []; 

      this.startEvent;

      this.arrivals = [];

      this.loadEngineDetailsFromDiagram(diagram);
      
    }
  
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

      this.generateArrivalTimes(diagram);

      console.log(this);

 
    }

    generateArrivalTimes(diagram) {
      let currentTime = 0;
     
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
          currentTime += Math.floor(arrivalInSecs);
          this.arrivals.push({ time: currentTime, instanceId: i });
        }
        
      }

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

    addResource(resource, resourceType) {
      if (!this.resourcePools[resourceType]) {
        this.resourcePools[resourceType] = [];
        this.queueByResourceType[resourceType] = new PriorityQueue({comparator: (a, b) => a.priority - b.priority});
      }
      this.resourcePools[resourceType].push(resource); 
    }
  
    addWorkItemToQueue(item, resourceType, instanceID) {
        
        if (!this.queueByResourceType[resourceType]) {
            throw new Error(`Queue for resource type '${resourceType}' does not exist.`);
        }
      
        let workItem = new WorkItem(instanceID, item, this.currentTime);

        this.queueByResourceType[resourceType].queue({ task: workItem, priority: instanceID });
      }
  
      
   
    async run() {
      const runningTasks = new Set();

      while (/*this.hasTasks() || runningTasks.size > 0 || */this.arrivals.length > 0) {

        while (this.arrivals.length > 0 && this.currentTime >= this.arrivals[0].time) {
          const arrival = this.arrivals.shift(); 
          this.addWorkItemToQueue(this.startEvent, "Customer" , arrival.instanceId+1); 
          console.log(`Přidána instance ${arrival.instanceId} v čase ${this.currentTime}`);
        }

        

        // ŘEŠENÍ FRONT
        /*
        for (let resourceType in this.queueByResourceType) {
          const queue = this.queueByResourceType[resourceType];
          const availableResources = this.resourcePools[resourceType].filter(res => res.isAvailable);

          while (availableResources.length > 0 && queue.length > 0) {
            const resource = availableResources.shift();
            const taskWrapper = queue.dequeue();
            const task = taskWrapper.task.getItem();
            const instanceID = taskWrapper.task.getInstanceID();
            const ready = taskWrapper.task.getReadyToBeExecuted();
    
            const taskPromise = this.executeTask(task, resource, resourceType, instanceID,ready);

    
            runningTasks.add(taskPromise);

        
            taskPromise.then(() => {
              runningTasks.delete(taskPromise);
            });
          }
        }*/

      
        this.currentTime += 1;
      }
    
      console.log(this);
        console.log("Simulace skončena.");
        console.log('Log simulace:', this.log);
    
      }
  
    
    hasTasks() {
      for (let resourceType in this.queueByResourceType) {
        if (this.queueByResourceType[resourceType].length > 0) {
          return true;
        }
      }
      return false;
    }
  
  
    getAvailableResource(resourceType) {
      const availableResources = this.resourcePools[resourceType].filter(resource => resource.isAvailable);
      return availableResources.length > 0 ? availableResources[0] : null;
    }
  

    async executeTask(task, resource, resourceType, instanceID, preparedAt) {
      const taskStartTime = this.currentTime;
      console.log(`Úkol ${task.getID()} z instance ${instanceID} připraven k vykonání ve čase ${this.currentTime}`);
  
   
      resource.isAvailable = false;  
  

      const executionDuration = Math.floor(Math.random() * 10) + 1;
  

      const taskEndTime = taskStartTime + executionDuration;
  
  
      this.log.push({
        taskId: task.getID(),
        preparedAt: preparedAt,
        startedAt: taskStartTime,
        finishedAt: taskEndTime,
        instaceID: instanceID
      });
  
    
      await this.wait(executionDuration);
  
     
      resource.isAvailable = true;
  
      
      this.currentTime = taskEndTime;

      if (Array.isArray(task.getOuts()) && task.getOuts().length > 0) {
        
        task.getOuts().forEach(element => {
          if (element.getType() == "sequence") {

            let testelement = element.target;

            while(testelement instanceof Gateway) {
              if (Array.isArray(testelement.getOuts()) && testelement.getOuts().length > 0) {
                let randomIndex = Math.floor(Math.random() * testelement.getOuts().length);
                console.log('vylosovany index: ', randomIndex, ' , gateway vystupy:' , testelement.getOuts())
                testelement = testelement.getOuts()[randomIndex].target;
                console.log('vylosovana vetev:',  testelement.getDescription())
              }
            }
          
            this.addWorkItemToQueue(testelement, "pokus_id", instanceID)
        }
        });   
    
      }

      console.log(`Úkol ${task.getID()} z instance ${instanceID} dokončen ve čase ${taskEndTime}`);
    }
  
    // Simulace čekání (zpoždění trvání úkolu)
    wait(duration) {
      return new Promise(resolve => setTimeout(resolve, duration * 100)); // Convert to ms
    }
  }
  