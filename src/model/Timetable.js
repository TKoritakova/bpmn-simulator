
/**
 * Representation of diagram timetable.
 */
export class Timetable {
    /**
     * Creates an instance of class Timetable.
     * @param {string} name 
     * @param {number} beginDay 
     * @param {number} endDay 
     * @param {string} beginTime 
     * @param {string} endTime 
     */
    constructor(name, beginDay, endDay, beginTime, endTime) { 
        /** @type {string} */           
        this.name = name; 
        /** @type {number} */ 
        this.beginDay = beginDay;
        /** @type {number} */  
        this.endDay = endDay;
        /** @type {string} */ 
        this.beginTime = beginTime; 
        /** @type {string} */ 
        this.endTime = endTime; 
    }

    /**
     * Gets timetable name.
     * @returns {string} timetable name
     */
    getName() {
        return this.name;
    }

    /**
     * Sets new timetable name.
     * @param {string} name new name
     */
    setName(name) {
        this.name = name;
    }
    
    /**
     * Returns timetable begin day. Days: Mon 1, Tue 2, Wed 3, Thu 4, Fri 5, Sat 6, Sun 0.
     * @returns {number} day
     */
    getBeginDay() {
        return this.beginDay;
    }
    
    /**
     * Returns timetable end day. Days: Mon 1, Tue 2, Wed 3, Thu 4, Fri 5, Sat 6, Sun 0.
     * @returns {number} day
     */
    getEndDay() {
        return this.endDay;
    }
    
    /**
     * Returns timetable begin time.
     * @returns {string} time
     */
    getBeginTime() {
        return this.beginTime;
    }
    
    /**
     * Return timetable end time.
     * @returns {string} time
     */
    getEndTime() {
        return this.endTime;
    }

    /**
     * Sets timetable begin day. Days: Mon 1, Tue 2, Wed 3, Thu 4, Fri 5, Sat 6, Sun 0.
     * @param {number} beginDay new begin day
     */
    setBeginDay(beginDay) {
        this.beginDay = beginDay;
    }
    
    /**
     * Sets timetable end day. Days: Mon 1, Tue 2, Wed 3, Thu 4, Fri 5, Sat 6, Sun 0.
     * @param {number} endDay new end day
     */
    setEndDay(endDay) {
        this.endDay = endDay;
    }
    
    /**
     * Sets timetable begin time.
     * @param {string} beginTime new begin time
     */
    setBeginTime(beginTime) {
        this.beginTime = beginTime;
    }
    
    /**
     * Sets timetable end time.
     * @param {string} endTime new end time
     */
    setEndTime(endTime) {
        this.endTime = endTime;
    }

    /**
   * Serializes the contents of a class into a json object.
   * @returns {*} timetable content in json form
   */
    toSerializableObject() {
        return {
            name: this.name,
            beginDay: this.beginDay,
            endDay: this.endDay,
            beginTime: this.beginTime,
            endTime: this.endTime
        };
    }
    
    /**
   * Deserializes a json object to an Timetable class instance.
   * @param {*} data class data in json form
   * @returns {Timetable} instance of class Timetable
   */
    static fromSerializableObject(data) {
        return new Timetable(data.name, data.beginDay, data.endDay, data.beginTime, data.endTime);
    }
 
  }
  