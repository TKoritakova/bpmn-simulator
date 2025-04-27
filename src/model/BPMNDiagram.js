import { BPMNObject } from "./BPMNObject";
import { Timetable } from "./Timetable";

export class BPMNDiagram {
    constructor() {
      this.objects = [];
      this.arrivalDistribution;
      this.arrivalMean;
      this.arrivalStdDeviation;
      this.arrivalUnit;
      this.numberOfInstances;
      this.startTime;
      this.currency;
      this.timetables = [];
    }

    
  
    addObject(obj) {
      if (obj instanceof BPMNObject) {
        this.objects.push(obj); 
      } else {
        console.log("Cannot add this object to diagram: " + obj);
      }
    }
  
    getAllObjects() {
      return this.objects;
    }

    getObjectByID(id) {
      return this.objects.find(obj => obj.getID() == id) || null;
    }

    addTimetable(timetable) {
      if (timetable instanceof Timetable) {
        this.timetables.push(timetable);
      }
    }

    getAllTimetables() {
      return this.timetables;
    }

    getTimetableByName(name) {
      return this.timetables.find(table => table.getName() == name) || null;
    }

    setArrivalDistribution(arrivalDistribution) {
      this.arrivalDistribution = arrivalDistribution;
    }
    
    setArrivalMean(arrivalMean) {
      this.arrivalMean = arrivalMean;
    }
    
    setArrivalStdDeviation(arrivalStdDeviation) {
      this.arrivalStdDeviation = arrivalStdDeviation;
    }
    
    setArrivalUnit(arrivalUnit) {
      this.arrivalUnit = arrivalUnit;
    }
    
    setNumberOfInstances(numberOfInstances) {
      this.numberOfInstances = numberOfInstances;
    }
    
    setStartTime(startTime) {
      this.startTime = startTime;
    }
    
    setCurrency(currency) {
      this.currency = currency;
    }

    getArrivalDistribution() {
      return this.arrivalDistribution;
    }
    
    getArrivalMean() {
      return this.arrivalMean;
    }
    
    getArrivalStdDeviation() {
      return this.arrivalStdDeviation;
    }
    
    getArrivalUnit() {
      return this.arrivalUnit;
    }
    
    getNumberOfInstances() {
      return this.numberOfInstances;
    }
    
    getStartTime() {
      return this.startTime;
    }
    
    getCurrency() {
      return this.currency;
    }
  }
  