

export class FlowObject {
    constructor(description, duration, ID) {
      if (new.target === FlowObject) {
        throw new TypeError('Cannot instantiate abstract class FlowObject directly');
      }
      this.description = description;
      this.duration = duration;
      this.ID = ID;
    }
  
    execute() {
      throw new Error('Method "execute()" must be implemented in subclass');
    }
  }
  