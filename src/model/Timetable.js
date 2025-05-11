
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

    setName(name) {
        this.name = name;
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

    setBeginDay(beginDay) {
        this.beginDay = beginDay;
    }
    
    setEndDay(endDay) {
        this.endDay = endDay;
    }
    
    setBeginTime(beginTime) {
        this.beginTime = beginTime;
    }
    
    setEndTime(endTime) {
        this.endTime = endTime;
    }

    toSerializableObject() {
        return {
          name: this.name,
          beginDay: this.beginDay,
          endDay: this.endDay,
          beginTime: this.beginTime,
          endTime: this.endTime
        };
      }
    
      static fromSerializableObject(data) {
        return new Timetable(data.name, data.beginDay, data.endDay, data.beginTime, data.endTime);
      }
 
  }
  