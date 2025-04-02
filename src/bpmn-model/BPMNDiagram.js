export class BPMNDiagram {
    constructor() {
      this.objects = [];
    }
  
    addObject(obj) {
      this.objects.push(obj);
    }
  
    getAllObjects() {
      return this.objects;
    }
  }
  