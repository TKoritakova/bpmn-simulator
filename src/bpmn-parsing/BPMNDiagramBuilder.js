// src/model/builders/BPMNDiagramBuilder.js
import { BPMNDiagram } from '../model/BPMNDiagram';
import { Activity } from '../model/Activity';
import { Gateway } from '../model/Gateway';

export class BPMNDiagramBuilder {
  constructor() {
    this.diagram = new BPMNDiagram();
  }

  addActivity(data) {
    const activity = new Activity(data.description, data.duration, data.id, data.x, data.y);
    this.diagram.addObject(activity);
  }

  addGateway(data) {
    const gateway = new Gateway(data.description, 0, data.id, data.type);
    this.diagram.addObject(gateway);
  }

  build() {
    return this.diagram;
  }
}
