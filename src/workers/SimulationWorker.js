import { SimulationEngine } from '../simulation/SimulationEngine.js';
import { BPMNDiagram } from '../model/BPMNDiagram.js';
import { Statistics } from '../simulation/Statistics.js';
import { BPMNAssembler } from '../bpmn-parsing/BPMNAssembler.js';
import { FlowObject } from '../model/FlowObject.js';
import { ConnectingObject } from '../model/ConnectingObject.js';


/**
 * Web Worker listener for running BPMN diagram simulations.
 * 
 * Expects a serialized BPMN diagram (`diagramData`) as input,
 * reconstructs all objects, message flows and reference links,
 * then runs the simulation and returns the resulting event log and statistics.
 * 
 * @listener
 * @param {MessageEvent} event - message event containing simulation input data
 * @param {Object} event.data - input payload
 * @param {*} event.data.diagramData - serialized BPMNDiagram to simulate
 * 
 * @postMessage {Object} result
 * @postMessage {Object[]} result.log - simulation event log
 * @postMessage {*} result.stats - calculated simulation statistics
 * @postMessage {Object} [error] - error message, if simulation fails
 */
self.onmessage = async (event) => {
  const { diagramData } = event.data;


  try {

    // Deserialize BPMN diagram
    const diagram = BPMNDiagram.fromSerializableObject(diagramData);

    diagram.getAllObjects().forEach(element => {
        /* Add message connections */
        if (element instanceof ConnectingObject && element.getType() === 'message') {
            BPMNAssembler.addMessageConnections(diagram, element);
        }

        /* Add referencies */
        if (element instanceof FlowObject) {
            BPMNAssembler.createReferenceConnectionsFlowObj(diagram, element);

        } else if (element instanceof ConnectingObject) {
            BPMNAssembler.createReferenceConnectionsConnectingObj(diagram, element);
        } 
        
    });

    // Initialize and run the simulation engine
    const engine = new SimulationEngine(diagram);
    await engine.run();
 
    // Collect and return statistics
    const stats = Statistics.createStatistics(engine.log, diagram);
  
    self.postMessage({
      log: engine.log,
      stats
    });
  } catch (err) {
    // Return error if simulation fails
    self.postMessage({ error: err.message });
  }
};