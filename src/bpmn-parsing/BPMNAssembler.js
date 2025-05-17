import { Activity } from '../model/Activity';
import { BPMNDiagram } from '../model/BPMNDiagram';
import { Event } from '../model/Event';
import { Gateway } from '../model/Gateway';
import { ConnectingObject } from '../model/ConnectingObject';
import { DataObject } from '../model/DataObject';
import { MessageEvent } from '../model/MessageEvent';
import { TimerEvent } from '../model/TimerEvent';
import { FlowObject } from '../model/FlowObject';
import { Participant } from '../model/Participant';
import { XMLParser } from 'fast-xml-parser';
import { Timetable } from '../model/Timetable';

export class BPMNAssembler {
  static async buildFromDefinitions(definitions, simulationDataPath) {
    const diagram = new BPMNDiagram();

    if(definitions.rootElements.length > 0) {
        for (const element of definitions.rootElements) {
            if (element.$type == 'bpmn:Process') {
                let participant = new Participant(null,element.id);
                diagram.addObject(participant);
            }

            if(element.hasOwnProperty('flowElements') && element.flowElements.length > 0) { /* FLOW ELEMENTY - OBJEKTY */
                for (const flowElement of element.flowElements) {      
                    this.createFlowObjects(flowElement,diagram);
                }              
            } else if(element.hasOwnProperty('messageFlows') && element.messageFlows.length > 0) {
                for (const messageFlow of element.messageFlows) {
                    if (messageFlow.$type == 'bpmn:MessageFlow') { /* MESSAGE FLOW */
                        let messageFlowConnector = new ConnectingObject("", messageFlow.id, "message", messageFlow.sourceRef.id, messageFlow.targetRef.id);                 
                        diagram.addObject(messageFlowConnector);
                    } else {
                        console.info('Element cannot be added: ' + messageFlow.id );                      
                    }
                }
            }
        }

    }

    let simulationData = await this.loadAndParseXMLSimulationData(simulationDataPath);
    this.updateDiagramData(diagram, simulationData);
    console.log(diagram)
    
    return diagram;
  }

    static updateDiagramData(diagram, simulationData) {
        diagram.getAllObjects().forEach(element => {
            /* PŘIDÁNÍ MESSAGE SPOJENÍ */
            if (element instanceof ConnectingObject && element.getType() === 'message') {
                this.addMessageConnections(diagram, element);
            }

            /* VYTVOŘENÍ ODKAZOVÝCH PROPOJŮ */
            if (element instanceof FlowObject) {
                this.createReferenceConnectionsFlowObj(diagram, element);

                /* PŘIDÁNÍ SIMULAČNÍCH DAT */
                this.processSimulationDataFlowElements(simulationData, element);
            } else if (element instanceof ConnectingObject) {
                this.createReferenceConnectionsConnectingObj(diagram, element);
            } else if (element instanceof Participant) {
                this.processSimulationDataParticipants(element, simulationData);
            }
            
        });

        this.processSimulationDataScenarioSpecs(simulationData.simulation.scenariospecs,diagram);
        this.processSimulationDataTimetables(simulationData.simulation.timetable,diagram);
        this.processSimulationDataNewParticipants(simulationData.simulation.resource,diagram);
        
    }

    static addMessageConnections(diagram, element) {   
        diagram.getAllObjects().forEach(targetOrSourceElement => { 
            if (element.getTarget() == targetOrSourceElement.getID()) {
                targetOrSourceElement.getIns().push(element.ID);
            } else if (element.getSource() == targetOrSourceElement.getID()) {
                targetOrSourceElement.getOuts().push(element.ID);
            }
        });        
    }

  static createReferenceConnectionsFlowObj(diagram, element) {
        if (Array.isArray(element.getIns()) && element.getIns().length > 0) {
            this.createReferenceConnectionsFlowObjIns(diagram, element);
        }

        if (Array.isArray(element.getOuts()) && element.getOuts().length > 0) {
            this.createReferenceConnectionsFlowObjOuts(diagram, element);
        }
  }

  static createReferenceConnectionsFlowObjIns(diagram, element) {    
    let newIns = new Array();
    element.getIns().forEach(incoming => {        
        diagram.getAllObjects().forEach(searchedElement => {
            if (searchedElement.getID() === incoming) {
                newIns.push(searchedElement);
            }
        });
    });
    element.setIns(newIns);   
  }

  static createReferenceConnectionsFlowObjOuts(diagram, element) {
    let newOuts = new Array();
    element.getOuts().forEach(outgoing => {
        diagram.getAllObjects().forEach(searchedElement => {                       
            if (searchedElement.getID() === outgoing) {
                newOuts.push(searchedElement);
            }
        });
    });
    element.setOuts(newOuts);
  }

  static createReferenceConnectionsConnectingObj(diagram, element) {
    this.createReferenceConnectionsConnectingObjSource(diagram, element);
    this.createReferenceConnectionsConnectingObjTarget(diagram, element);    
  }

  static createReferenceConnectionsConnectingObjSource(diagram, element) {
    let newSource;           
    diagram.getAllObjects().forEach(searchedElement => {
        if (searchedElement.getID() === element.getSource()) {                   
            newSource = searchedElement;
        }
    });

    if (newSource) {
        element.setSource(newSource);
    }
  }

  static createReferenceConnectionsConnectingObjTarget(diagram, element) {
    let newTarget;
    diagram.getAllObjects().forEach(searchedElement => {
        if (searchedElement.getID() === element.getTarget()) {
            newTarget = searchedElement;
        }
    });

    if (newTarget) {
        element.setTarget(newTarget);
    }
  }


  static createFlowObjects(flowElement, diagram) {
    let flowObject;

    /* ZAJIŠTĚNÍ PŘEDCHŮDCŮ A NÁSLEDNÍKŮ */
    let ins = this.getIns(flowElement);
    let outs = this.getOuts(flowElement);

    /* VYTVÁŘENÍ JEDNOTLIVÝCH ELEMENTŮ */
    if (flowElement.$type == 'bpmn:ExclusiveGateway') { /* EXKLUZIVNÍ GATEWAY */
        flowObject = new Gateway(flowElement.name, flowElement.id, "Exclusive", ins, outs);
    } else if (flowElement.$type == 'bpmn:Task') { /* TASKY/AKTIVITY */
        flowObject = new Activity(flowElement.name, flowElement.id, ins, outs)  
    } else if (flowElement.$type == 'bpmn:StartEvent') { /* START event */
        flowObject = new Event(flowElement.name, flowElement.id, ins, outs, "start");
    } else if (flowElement.$type == 'bpmn:EndEvent') { /* END event */
        flowObject = new Event(flowElement.name, flowElement.id, ins, outs, "end");
    } else if (flowElement.$type == 'bpmn:SequenceFlow') { /* SEQUENCE FLOW */
        flowObject = new ConnectingObject(flowElement.name, flowElement.id, "sequence", flowElement.sourceRef.id, flowElement.targetRef.id);                 
    } else if (flowElement.$type == 'bpmn:DataObjectReference') { /* DATOVÝ OBJEKT */
        flowObject = new DataObject(flowElement.name, flowElement.id);                
    } else if (flowElement.$type == 'bpmn:IntermediateCatchEvent') { /* CATCHING EVENTY */
        flowObject = this.addIntermediateCatchEvent(flowElement,ins,outs);
    } else if ((flowElement.$type == 'bpmn:DataObject')) {
        flowObject = new DataObject(flowElement.name, flowElement.id);
    } else {
        console.info('Element cannot be processed: ' + flowElement.id + ', ' + flowElement.name);
    }

    /* PŘIDÁNÍ DO DIAGRAMU */
    if (flowObject) {
        diagram.addObject(flowObject);
    }
    
  }

  static addIntermediateCatchEvent(flowElement, ins, outs) {
    let intermediateCatchEventEvent;

    if (flowElement.eventDefinitions.length > 0) {
        const eventType = flowElement.eventDefinitions[0].$type;
        if (eventType == 'bpmn:TimerEventDefinition') {
            intermediateCatchEventEvent = new TimerEvent(flowElement.name, flowElement.id, ins, outs, "intermediate");  
        } else if (eventType == 'bpmn:MessageEventDefinition') {
            intermediateCatchEventEvent = new MessageEvent(flowElement.name, flowElement.id, ins, outs, "intermediate");       
        } else {
            console.log("This event cannot be added due to its type. Event: " + flowElement)
        }
    }

    return intermediateCatchEventEvent;
  }

  static getIns(flowElement) {
    let ins = new Array();                   
    if (flowElement.incoming && typeof flowElement.incoming[Symbol.iterator] === 'function') {
        for (const inEl of flowElement.incoming) {
            ins.push(inEl.id);
        }
    }
    return ins;
  }

  static getOuts(flowElement) {
    let outs = new Array();
    if (flowElement.outgoing && typeof flowElement.outgoing[Symbol.iterator] === 'function') {
        for (const outEl of flowElement.outgoing) {
            outs.push(outEl.id);
        }
    }
    return outs;
  }

  /* SIMULATION DATA PROCESSING */
  static async loadAndParseXMLSimulationData(filePath) {

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Error while loading file ${filePath}: ${response.statusText}`);
        }
  
        const xmlData = await response.text();
        const parser = new XMLParser();
        const jsonObj = parser.parse(xmlData);
  
        return jsonObj;
      } catch (error) {
        console.error('Error while loading or parsing file ', filePath, ':', error);
      }
  }

  static processSimulationDataFlowElements(data, flowElement) {

    if (!data || !data.simulation || !data.simulation.element) {
        console.error('Invalid simulation data.');

    } else {
        let elements = data.simulation.element;    

        if (!Array.isArray(elements)) {
          elements = [elements];
          data.simulation.element = elements;
        }
      
        const index = elements.findIndex(el => el.id == flowElement.getID());

        if (index !== -1) {
            const foundElement = elements.splice(index, 1)[0];

            this.processSimulationDataOneFlowElement(foundElement, flowElement);

    
        } 

    }
  }

    static processSimulationDataOneFlowElement(data, element) {
        if (element instanceof Activity) {
            element.setResource(data.resource);
            element.setFixedCosts(data.fixedcost);
            element.setDistribution(data.distribution);
            element.setUnit(data.unit);
            element.setMean(data.mean);
            element.setStdDeviation(data.stddeviation);               
        } else if (element instanceof Gateway && data.type2 == "Exlusive") {

            if (!Array.isArray(data.out)) {
                data.out = [data.out];
              }

            data.out.forEach(out => {
               element.addProbability(out.id,out.probability);  
            });

            
        } else if (element instanceof Event && element.getType() == "intermediate") {
            element.setDistribution(data.distribution);
            element.setUnit(data.unit);
            element.setMean(data.mean);
            element.setStdDeviation(data.stddeviation);  
        }
    }
    
    static processSimulationDataScenarioSpecs(data, diagram) {     
        diagram.setArrivalDistribution(data.arrivaldistribution);        
        diagram.setArrivalMean(data.arrivalmean);         
        diagram.setArrivalStdDeviation(data.arrivalstddeviation); 
        diagram.setArrivalUnit(data.arrivalunit);        
        diagram.setNumberOfInstances(data.numberofinstances);          
        diagram.setCurrency(data.currency);  
        
        
        let [datePart, timePart] = data.starttime.split(' ');
        let [day, month, year] = datePart.split('/').map(Number);
        let [hours, minutes] = timePart.split(':').map(Number);

        let date = new Date(year, month - 1, day, hours, minutes);
        
        diagram.setStartTime(date);

    }

    static processSimulationDataTimetables(data,diagram) {

        if (!Array.isArray(data)) {
            data = [data];
        }

        data.forEach(timetable => {
            let createdTimetable = new Timetable(timetable.name, this.convertDayToNumber(timetable.beginday), this.convertDayToNumber(timetable.endday), timetable.begintime, timetable.endtime);
            diagram.addTimetable(createdTimetable);
        }); 
       
    }

    static convertDayToNumber(day){
        switch (day) {
            case "Monday":
              return 1;
            case "Tuesday":
              return 2;
            case "Wednesday":
                return 3;
            case "Thursday":
              return 4;
            case "Friday":
              return 5;
            case "Saturday":
              return 6;
            case "Sunday":
              return 0;
            default:
              return 0;
          }
    }
      
    static processSimulationDataParticipants(participant,data) {
            let elements = data.simulation.resource;
             
            if (!Array.isArray(elements)) {
                elements = [elements];
                data.simulation.resource = elements;
            }
          
            const index = elements.findIndex(el => el.id == participant.getID());


            if (index !== -1) {
                const foundElement = elements.splice(index, 1)[0];

                participant.setCost(foundElement.costperhour);
                participant.setWorkingHours(foundElement.timetable);
                participant.setNumber(foundElement.number);
                participant.setDescription(foundElement.name);
    
            } 
        
    }

    static processSimulationDataNewParticipants(data,diagram) {
     
             
        if (!Array.isArray(data)) {
            data = [data];
        }

        data.forEach(newParticipant => {
            let participant = new Participant(newParticipant.name, newParticipant.id);
            participant.setCost(newParticipant.costperhour);
            participant.setWorkingHours(newParticipant.timetable);
            participant.setNumber(newParticipant.number);
            diagram.addObject(participant);
        });
        
      
    }
}
