

import { FlowObject } from './FlowObject.js';

export class Activity extends FlowObject {
  
  constructor(description, duration, ID, x, y, width, height) {
    super(description, duration, ID);
    this.x = x;       
    this.y = y;
    this.width = width;
    this.height = height;
  }

  execute() {
    console.log(`Executing activity ${this.description}`);
  }
}
