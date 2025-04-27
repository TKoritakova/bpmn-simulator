import PriorityQueue from 'js-priority-queue';
import { WorkItem } from './WorkItem';
import { Gateway } from '../model/Gateway';

export class SimulationEngine {
    constructor() {
      this.currentTime = 0;  
      this.resourcePools = {}; 
      this.queueByResourceType = {};  
      this.log = []; 
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
      /*while (this.hasTasks()) {
      
        for (let resourceType in this.queueByResourceType) {
          const availableResource = this.getAvailableResource(resourceType);
          console.log('Dostupný zdroj:', availableResource);
  
          if (availableResource) {
            const task = this.queueByResourceType[resourceType].dequeue(); 
            await this.executeTask(task.task.getItem(), availableResource, resourceType, task.task.getInstanceID(),task.task.getReadyToBeExecuted());
          }
        }
      }*/



      /*while (this.hasTasks()) {
        const allTasks = [];
    
        for (let resourceType in this.queueByResourceType) {
          const queue = this.queueByResourceType[resourceType];
          const availableResources = this.resourcePools[resourceType].filter(res => res.isAvailable);
    
          while (availableResources.length > 0 && queue.length > 0) {
            const resource = availableResources.shift(); 
            const taskWrapper = queue.dequeue(); 
            const task = taskWrapper.task.getItem();
            const instanceID = taskWrapper.task.getInstanceID();
            const ready = taskWrapper.task.getReadyToBeExecuted();

            allTasks.push(
              this.executeTask(task, resource, resourceType, instanceID, ready)
            );
          }
        }
    

        await Promise.all(allTasks);
      }*/

    const runningTasks = new Set();

    while (this.hasTasks() || runningTasks.size > 0) {
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
      }

    
      await this.wait(0.1);
    }
  
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
  