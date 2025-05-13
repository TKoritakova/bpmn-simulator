import { Activity } from "../model/Activity";
import random from 'random';
import { Participant } from "../model/Participant";

export class Statistics {
    static createStatistics(log, diagram) {
        let result = {}

        result["general"] = this.generateGeneralStatistics(log,diagram);
        result["instances"] = this.generateInstanceStatistics(log,diagram);
        result["activites"] = this.generateActivityStatistics(log,diagram);
        result["resources"] = this.generateResourceUtilization(log,diagram, result["general"]);

   
        

        return result;
    }



    static generateGeneralStatistics(log,diagram) {
        const stats = {
            numberOfInstances: diagram.getNumberOfInstances(),
            totalPrice: 0,
            totalWarehouse: 0,
            totalRealExecutionTime: 0, //doba provádění v realitě
            totalWholeDuration: 0, //celkový čas - běh + čekání
            totalDuration: 0, //posčítaný čas všech běhů úloh
            totalDurationWithoutOfftime: 0, // bez nocí
            totalWaitingForExecution: 0, // všechny časy čekání
            efektivnost: 0,
            efektivnost1: 0,
        }

        let maxEndTime = 0;
        for (const workItem of log) {
            let item = workItem.getItem();
            let prepared = workItem.getReadyToBeExecuted();
            let start = workItem.getStartTime();
            let end = workItem.getCompletedTime();
            let executionTime = workItem.executionTime ?? 0;

            if (end > maxEndTime) {
              maxEndTime = end;
            }
        
            if (start === null || end === null) {
              continue;
            }
        
               
            stats.totalWholeDuration += (end - prepared);
            stats.totalDuration += (end - start);
            stats.totalDurationWithoutOfftime += executionTime;
            stats.totalWaitingForExecution += (start - prepared);
        
         
            if (item instanceof Activity) {
              const resource = diagram.getObjectByDescription(item.getResource());
              if (resource) {
                const price = resource.getCost() * (executionTime / 3600); 
                stats.totalPrice += price;
              }
            }
          }

          stats.totalWarehouse = this.generateWarehouseCost(diagram,maxEndTime);

          stats.totalRealExecutionTime = maxEndTime;
          stats.efektivnost = stats.totalDuration / stats.totalWholeDuration * 100;
          stats.efektivnost1 = stats.totalDurationWithoutOfftime / stats.totalWholeDuration * 100;
          return stats;
    }

    static generateInstanceStatistics(log, diagram) {
      const instances = new Map(); // místo Setu!

      for (const workItem of log) {
        let instanceID = workItem.getInstanceID();
        let item = workItem.getItem();
        let prepared = workItem.getReadyToBeExecuted();
        let start = workItem.getStartTime();
        let end = workItem.getCompletedTime();
        let executionTime = workItem.executionTime ?? 0;

        if (start === null || end === null) {
          continue;
        }

        if (!instances.has(instanceID)) {
          instances.set(instanceID, {
            name: instanceID,
            totalPrice: 0,
            totalWholeDuration: 0,
            totalDuration: 0,
            totalDurationWithoutOfftime: 0,
            totalWaitingForExecution: 0,
          });
        }

        const stats = instances.get(instanceID);

        stats.totalWholeDuration += (end - prepared);
        stats.totalDuration += (end - start);
        stats.totalDurationWithoutOfftime += executionTime;
        stats.totalWaitingForExecution += (start - prepared);

        if (item instanceof Activity) {
          const resource = diagram.getObjectByDescription(item.getResource());
          if (resource) {
            const price = resource.getCost() * (executionTime / 3600);
            stats.totalPrice += price;
          }
        }
      }

      const instanceStats = {
        instances: instances,
        minPrice: Math.min(...Array.from(instances.values(), x => x.totalPrice)),
        avgPrice: [...instances.values()].reduce((sum, stats) => sum + stats.totalPrice, 0) / diagram.getNumberOfInstances() ,
        maxPrice: Math.max(...Array.from(instances.values(), x => x.totalPrice)),
        minWholeDuration: Math.min(...Array.from(instances.values(), x => x.totalWholeDuration)),
        avgWholeDuration: [...instances.values()].reduce((sum, stats) => sum + stats.totalWholeDuration, 0) / diagram.getNumberOfInstances() ,
        maxWholeDuration: Math.max(...Array.from(instances.values(), x => x.totalWholeDuration)),
        minDuration: Math.min(...Array.from(instances.values(), x => x.totalDuration)),
        avgDuration: [...instances.values()].reduce((sum, stats) => sum + stats.totalDuration, 0) / diagram.getNumberOfInstances() ,
        maxDuration: Math.max(...Array.from(instances.values(), x => x.totalDuration)),
        minDurationWithoutOfftime: Math.min(...Array.from(instances.values(), x => x.totalDurationWithoutOfftime)),
        avgDurationWithoutOfftime: [...instances.values()].reduce((sum, stats) => sum + stats.totalDurationWithoutOfftime, 0) / diagram.getNumberOfInstances() ,
        maxDurationWithoutOfftime: Math.max(...Array.from(instances.values(), x => x.totalDurationWithoutOfftime)),
        minWaitingForExecution: Math.min(...Array.from(instances.values(), x => x.totalWaitingForExecution)),
        avgWaitingForExecution: [...instances.values()].reduce((sum, stats) => sum + stats.totalWaitingForExecution, 0) / diagram.getNumberOfInstances() ,
        maxWaitingForExecution: Math.max(...Array.from(instances.values(), x => x.totalWaitingForExecution)),
      };

      return instanceStats;

    }

    static generateActivityStatistics(log, diagram) {
        const activityStats = {};
        
        for (const workItem of log) {
          let item = workItem.getItem();
          let activityID = item.getID();
      
          let prepared = workItem.getReadyToBeExecuted();
          let start = workItem.getStartTime();
          let end = workItem.getCompletedTime();
          let executionTime = workItem.getExecutionTime();
      
          if (start === null || end === null) {
            continue;
          }
      
          let price;
          if (item instanceof Activity) {
            let resource = diagram.getObjectByDescription(item.getResource());
            price = resource.getCost() * (executionTime / 3600)
          } else {
            price = 0;
          }


        
          if (!activityStats[activityID]) {
            activityStats[activityID] = {
                name: item.getDescription(),
                wholeDuration: [], //čas celé aktivity prep - end
                duration: [], // čas start-end
                durationWithoutOfftime: [], //čas start-end bez noci
                waitingForExecution: [], //čas prep-start
                prices: [],
                instances: new Set(),
            };
          }
      
          activityStats[activityID].wholeDuration.push(end - prepared);
          activityStats[activityID].duration.push(end - start);
          activityStats[activityID].durationWithoutOfftime.push(executionTime ?? 0);
          activityStats[activityID].waitingForExecution.push(start - prepared);
          activityStats[activityID].prices.push(price);
          activityStats[activityID].instances.add(workItem.getInstanceID());
        }
      

        const result = {};
      
        for (const [activityID, data] of Object.entries(activityStats)) {
             
          result[activityID] = {
            name: data.name,
            count: data.duration.length,
            percInstances: data.instances.size / diagram.getNumberOfInstances() * 100,
            minWholeDuration: Math.min(...data.wholeDuration),
            maxWholeDuration: Math.max(...data.wholeDuration),
            avgWholeDuration: data.wholeDuration.reduce((sum, t) => sum + t, 0) / data.wholeDuration.length,
            minDuration: Math.min(...data.duration),
            maxDuration: Math.max(...data.duration),
            avgDuration: data.duration.reduce((sum, t) => sum + t, 0) / data.duration.length,
            minDurationWithoutOfftime: Math.min(...data.durationWithoutOfftime),
            maxDurationWithoutOfftime: Math.max(...data.durationWithoutOfftime),
            avgDurationWithoutOfftime: data.durationWithoutOfftime.reduce((sum, t) => sum + t, 0) / data.durationWithoutOfftime.length,
            minWaitingForExecution: Math.min(...data.waitingForExecution),
            maxWaitingForExecution: Math.max(...data.waitingForExecution),
            avgWaitingForExecution: data.waitingForExecution.reduce((sum, t) => sum + t, 0) / data.waitingForExecution.length,
            minPrice: Math.min(...data.prices),
            maxPrice: Math.max(...data.prices),
            avgPrice: data.prices.reduce((sum, t) => sum + t, 0) / data.prices.length,    
          };
        }
      
        return result;
      }

      static countWorktimeForRecource(diagram,timetable,general) {
        let resultSecs = []

      
        const startDate = diagram.getStartTime();
        let day = startDate.getDay() == 0 ? 7 : startDate.getDay();
        let hour = startDate.getHours();
        let minute = startDate.getMinutes();
        let remainingTime = general.totalRealExecutionTime;

        let beginTime = timetable.getBeginTime().split(':').map(Number);
        let endTime = timetable.getEndTime().split(':').map(Number);
        let shiftLenght = (endTime[0] * 60 * 60 + endTime[1] * 60) - (beginTime[0] * 60 * 60 + beginTime[1] * 60)
        let beginDay = timetable.getBeginDay() == 0 ? 7 : timetable.getBeginDay();
        let endDay = timetable.getEndDay() == 0 ? 7 : timetable.getEndDay();

        while (remainingTime > 0) {          
          const isWorkingDay = (day >= beginDay && day <= endDay); 
          

          if (isWorkingDay) {
     

            if ((hour > beginTime[0] || (hour == beginTime[0] && minute >= beginTime[1])) && (hour < endTime[0] || (hour == endTime[0]  && minute <= endTime[1]))) {
              let timeUntilDayEnd = (60 * 60 * 24) - (hour * 60 * 60 + minute * 60);
              let timeUntilShiftEnd = shiftLenght - ((hour * 60 * 60 + minute * 60) - (beginTime[0] * 60 * 60 + beginTime[1] * 60))
           
              if (remainingTime >= timeUntilDayEnd || remainingTime >= timeUntilShiftEnd) {
                resultSecs.push(timeUntilShiftEnd);               
              } else {
                resultSecs.push(remainingTime); 
              }
              remainingTime -= timeUntilDayEnd;
              hour = 0;
              minute = 0;
            } else if (hour < beginTime[0] || (hour == beginTime[0] && minute < beginTime[1])) {
              let timeUntilDayEnd = (60 * 60 * 24) - (hour * 60 * 60 + minute * 60);
              let timeShiftStart = (beginTime[0] * 60 * 60 +beginTime[1] * 60)

              if (remainingTime <= timeShiftStart) {
                remainingTime -= timeUntilDayEnd;
                hour = 0;
                minute = 0;
              } else if (remainingTime <= (timeShiftStart + shiftLenght)) {
                resultSecs.push(remainingTime - timeShiftStart);
                remainingTime -= timeUntilDayEnd;
                hour = 0;
                minute = 0;
              } else {
                resultSecs.push(shiftLenght);
                remainingTime -= timeUntilDayEnd;
                hour = 0;
                minute = 0;
              }

            } else {
              let timeUntilDayEnd = (60 * 60 * 24) - (hour * 60 * 60 + minute * 60);
              remainingTime -= timeUntilDayEnd;
              hour = 0;
              minute = 0;
            }
            

            
          } else {
            let timeUntilDayEnd = (60 * 60 * 24) - (hour * 60 * 60 + minute * 60);
            remainingTime -= timeUntilDayEnd;
            hour = 0;
            minute = 0;
          }
          
          day = (day + 1) == 8 ? 1 : (day + 1);
            
        }

        return resultSecs.reduce((a, b) => a + b, 0);
        
      }

      static generateResourceUtilization(log, diagram, general) {
        const result = {};
        const participants = diagram.getAllObjects().filter(obj => obj instanceof Participant && obj.number > 0);
        
        for (const participant of participants) {
          let shiftLenght = this.countWorktimeForRecource(diagram,diagram.getTimetableByName(participant.getWorkingHours()),general)

          result[participant.getID()] = {
            id: participant.getID(),
            name: participant.getDescription(),
            count: participant.getNumber(),
            oneShiftsLenght: shiftLenght,
            allShiftsLenght: shiftLenght * participant.getNumber(),
            workedTime: 0
          }

          
         
        }

        for (const workItem of log) {
          let item = workItem.getItem();

          if (item instanceof Activity) {
            let resource = diagram.getObjectByDescription(item.getResource());
            let executionTime = workItem.getExecutionTime();
            result[resource.getID()].workedTime += executionTime;
            
          } 


        }

        return result;


      }

      static formatCzechUnit(count, forms) {
        if (count <= 1) return forms[0];
        if (count >= 2 && count <= 4) return forms[1];
        return forms[2];
      }

      static prepareValueForReading(value) {
        if (value == null || value <= 0) return "0 sekund";
        const parts = [];
      
        const units = [
          { seconds: 60 * 60 * 24 * 7, name: ['týden', 'týdny', 'týdnů'] },
          { seconds: 60 * 60 * 24, name: ['den', 'dny', 'dní'] },
          { seconds: 60 * 60, name: ['hodina', 'hodiny', 'hodin'] },
          { seconds: 60, name: ['minuta', 'minuty', 'minut'] },
          { seconds: 1, name: ['sekunda', 'sekundy', 'sekund'] },
        ];
      
        for (const unit of units) {
          const count = Math.floor(value / unit.seconds);
          if (count > 0) {
          parts.push({ count, name: this.formatCzechUnit(count, unit.name) });
          value -= count * unit.seconds;
        }
        }

        const result = parts.slice(0, 2).map(p => `${p.count} ${p.name}`).join(' ');
        return result;
      }
      
      
      

      static convertGeneralDescriptions(value) {

        switch(value){
          case "numberOfInstances":
            return "Celkový počet instancí: ";
          case "totalPrice":
            return "Celková cena: ";
          case "totalRealExecutionTime":
            return "Reálná doba provádění: ";
          case "totalWholeDuration":
            return "Celkový běh simulace: ";
          case "totalDuration":
            return "Celkový čas provádění úloh: ";
          case "totalDurationWithoutOfftime":
            return "Celkový čas provádění úloh v pracovní době: ";
          case "totalWaitingForExecution":
            return "Celkový čas čekání: ";
          case "efektivnost":
            return "Efektivita procesu: ";
          case "efektivnost1":
            return "Efektivita procesu (v pracovní době): ";
          default:
            return value;
        }
      
      }

      static convertGeneralValues(description, value, diagram) {

        switch (description) {
          case "totalPrice":
            if (diagram.getCurrency() == "CZK") {
              return new Intl.NumberFormat('cs-CZ', {
                style: 'currency',
                currency: 'CZK',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(value);
            } else {           
              return value.toFixed(2) + diagram.getCurrency();
            }
          case "totalRealExecutionTime":
          case "totalWholeDuration":
          case "totalDuration":
          case "totalDurationWithoutOfftime":
          case "totalWaitingForExecution":
            return this.prepareValueForReading(value);
        
          case "efektivnost":
          case "efektivnost1":
            return value.toFixed(2) + " %";
        
          default:
            return value;
        }
      
      }


      static convertInstancesValues(description, value, diagram) {

        switch (description) {
          case "minPrice":
          case "avgPrice":
          case "maxPrice":
            return value.toFixed(2) + ' ' + diagram.getCurrency();
        
          case "minWholeDuration":
          case "avgWholeDuration":
          case "maxWholeDuration":
          case "minDuration":
          case "avgDuration":
          case "maxDuration":
          case "minDurationWithoutOfftime":
          case "avgDurationWithoutOfftime":
          case "maxDurationWithoutOfftime":
          case "minWaitingForExecution":
          case "avgWaitingForExecution":
          case "maxWaitingForExecution":
            return this.prepareValueForReading(value);

        
          default:
            return value;
        }
      
      }

      static generateWarehouseCost (diagram, simulationDuration) {

        const gateway = diagram.getObjectByID("Gateway_VseNaskladneno");
        if (gateway) {
          const probability = gateway.getProbabilities().find(p => p.id === "Flow_VseNaskladneno_OpravitAutomobil");
          const weeks = simulationDuration / (3600 * 7 * 24 * 4)

        if (probability) {
          if (probability.probability >= 0.65) { //high
            const generator = random.exponential(1/70000);
            return (generator() + 30001) * weeks;            
          } else if (probability.probability <= 0.35) { //low
            return random.int(3000,10000) * weeks;
          } else { //middle
            return random.int(10001,30000) * weeks;
          }
        }
      }
      return null;

      }
}