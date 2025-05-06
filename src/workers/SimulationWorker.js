import { SimulationEngine } from '../simulation/SimulationEngine.js';
import { BPMNDiagram } from '../model/BPMNDiagram.js';
import { Statistics } from '../simulation/Statistics.js';
import { BPMNAssembler } from '../bpmn-parsing/BPMNAssembler.js';
import { FlowObject } from '../model/FlowObject.js';
import { ConnectingObject } from '../model/ConnectingObject.js';

self.onmessage = async (event) => {
  const { diagramData } = event.data;


  try {

    const diagram = BPMNDiagram.fromSerializableObject(diagramData);

    diagram.getAllObjects().forEach(element => {
        /* PŘIDÁNÍ MESSAGE SPOJENÍ */
        if (element instanceof ConnectingObject && element.getType() === 'message') {
            BPMNAssembler.addMessageConnections(diagram, element);
        }

        /* VYTVOŘENÍ ODKAZOVÝCH PROPOJŮ */
        if (element instanceof FlowObject) {
            BPMNAssembler.createReferenceConnectionsFlowObj(diagram, element);

        } else if (element instanceof ConnectingObject) {
            BPMNAssembler.createReferenceConnectionsConnectingObj(diagram, element);
        } 
        
    });

    
    const engine = new SimulationEngine(diagram);
    await engine.run();
 

    const stats = Statistics.createStatistics(engine.log, diagram);
  

 
    self.postMessage({
      log: engine.log,
      stats
    });
  } catch (err) {
    self.postMessage({ error: err.message });
  }
};