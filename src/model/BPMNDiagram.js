import { BPMNObject } from "./BPMNObject";
import { Timetable } from "./Timetable";
import { deserializeBPMNObject } from "../bpmn-parsing/BPMNObjectFactory";

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

  getObjectByDescription(description) {
    return this.objects.find(obj => obj.getDescription() == description) || null;
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
    
  }
  