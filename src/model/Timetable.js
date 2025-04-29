
export class Timetable {
    constructor(name, beginDay, endDay, beginTime, endTime) {           
        this.name = name; 
        this.beginDay = beginDay; 
        this.endDay = endDay;
        this.beginTime = beginTime; 
        this.endTime = endTime; 
    }

    getName() {
        return this.name;
    }
    
    getBeginDay() {
        return this.beginDay;
    }
    
    getEndDay() {
        return this.endDay;
    }
    
    getBeginTime() {
        return this.beginTime;
    }
    
    getEndTime() {
        return this.endTime;
    }
 
  }
  