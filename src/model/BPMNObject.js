
export class BPMNObject {
    constructor(description, ID) {
      if (new.target === BPMNObject) {
        throw new TypeError('Cannot instantiate abstract class BPMNObject directly');
      }
      this.description = description;
      this.ID = ID;
     
    }
  
    getDescription() {
      return this.description;
    }

    setDescription(description) {
      this.description = description;
    }

    getID() {
      return this.ID;
    }

    setID(ID) {
      this.ID = ID;
    }
  }