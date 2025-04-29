import { BPMNObject } from "./BPMNObject";


export class Participant extends BPMNObject {
    constructor(description, ID) {   
        super(description, ID); 
        this.cost;
        this.workingHours;
        this.number;
    }

    getCost() {
        return this.cost;
    }

    setCost(value) {
    this.cost = value;
    }

    getWorkingHours() {
    return this.workingHours;
    }

    setWorkingHours(value) {
    this.workingHours = value;
    }
  
    setNumber(number) {
        this.number = number;
    }
    
    getNumber() {
        return this.number;
    } 
  }
  