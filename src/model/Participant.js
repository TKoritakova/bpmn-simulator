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

    toSerializableObject() {
        return {
          type: 'Participant',
          description: this.description,
          ID: this.ID,
          cost: this.cost,
          workingHours: this.workingHours,
          number: this.number
        };
      }
    
      static fromSerializableObject(data) {
        const obj = new Participant(data.description, data.ID);
        obj.cost = data.cost;
        obj.workingHours = data.workingHours;
        obj.number = data.number;
        return obj;
      }
  }

  
  