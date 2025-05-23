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

/**
 * Class for creating a diagram model based on data loaded by the bpmn-js library and an xml file with simulation data.
 */
export class BPMNAssembler {
    /**
     * Creates a BPMNDiagram based on definitions and an xml file.
     * @param {*} definitions definitions from object created by bpmn-js library
     * @param {string} simulationDataPath path to file where simulation data is
     * @returns {BPMNDiagram} created diagram
     */
    static async buildFromDefinitions(definitions, simulationDataPath) {
        const diagram = new BPMNDiagram();

        if(definitions.rootElements.length > 0) {
            for (const element of definitions.rootElements) {
                if (element.$type == 'bpmn:Process') {
                    let participant = new Participant(null,element.id);
                    diagram.addObject(participant);
                }
                if(element.hasOwnProperty('flowElements') && element.flowElements.length > 0) { /* FLOW ELEMENTS - OBJECTS */
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

        /* SIMULATION DATA PROCEESING */
        let simulationData = await this.loadAndParseXMLSimulationData(simulationDataPath);
        this.updateDiagramData(diagram, simulationData);
        
        return diagram;
    }

    /**
     * Updates the diagram after its basic loading. Adds references links and simulation data from the xml file.
     * @param {BPMNDiagram} diagram diagram to update
     * @param {*} simulationData loaded and parsed simulation data from xml file
     */
    static updateDiagramData(diagram, simulationData) {
        diagram.getAllObjects().forEach(element => {
            /* ADDING MESSAGE CONNECTION */
            if (element instanceof ConnectingObject && element.getType() === 'message') {
                this.addMessageConnections(diagram, element);
            }

            /* CREATING REFERENCES LINKS */
            if (element instanceof FlowObject) {
                this.createReferenceConnectionsFlowObj(diagram, element);

                /* ADDING SIMULATION DATA */
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

    /**
     * Adds message connections to diagram.
     * @param {BPMNDiagram} diagram diagram to update 
     * @param {*} element element
     */
    static addMessageConnections(diagram, element) {   
        diagram.getAllObjects().forEach(targetOrSourceElement => { 
            if (element.getTarget() == targetOrSourceElement.getID()) {
                targetOrSourceElement.getIns().push(element.ID);
            } else if (element.getSource() == targetOrSourceElement.getID()) {
                targetOrSourceElement.getOuts().push(element.ID);
            }
        });        
    }

    /**
     * Creates reference links for incoming and outgoing connecting objects for element.
     * @param {BPMNDiagram} diagram diagram to update 
     * @param {*} element element
     */
    static createReferenceConnectionsFlowObj(diagram, element) {
        if (Array.isArray(element.getIns()) && element.getIns().length > 0) {
            this.createReferenceConnectionsFlowObjIns(diagram, element);
        }

        if (Array.isArray(element.getOuts()) && element.getOuts().length > 0) {
            this.createReferenceConnectionsFlowObjOuts(diagram, element);
        }
    }

    /**
     * Creates reference links for incoming connecting objects for element.
     * @param {BPMNDiagram} diagram diagram to update 
     * @param {*} element element
     */
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

    /**
     * Creates reference links for outgoin connecting objects for element.
     * @param {BPMNDiagram} diagram diagram to update 
     * @param {*} element element
     */
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

    /**
     * Creates reference links for connecting objects to its source and target element.
     * @param {BPMNDiagram} diagram diagram to update 
     * @param {*} element element
     */
    static createReferenceConnectionsConnectingObj(diagram, element) {
        this.createReferenceConnectionsConnectingObjSource(diagram, element);
        this.createReferenceConnectionsConnectingObjTarget(diagram, element);    
    }

    /**
     * Creates reference links for connecting object to its source element.
     * @param {BPMNDiagram} diagram diagram to update 
     * @param {*} element element 
     */
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

    /**
     * Creates reference links for connecting object to its target element.
     * @param {BPMNDiagram} diagram diagram to update 
     * @param {*} element element 
     */
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

    /**
     * Creates flow object by its type. Adds object to diagram.
     * @param {*} flowElement flow element
     * @param {BPMNDiagram} diagram diagram
     */
    static createFlowObjects(flowElement, diagram) {
        let flowObject;

        /* PREDECESSORS AND SUCCESSORS */
        let ins = this.getIns(flowElement);
        let outs = this.getOuts(flowElement);

        /* CREATION OF INDIVIDUAL ELEMENTS */
        if (flowElement.$type == 'bpmn:ExclusiveGateway') { /* EXCLUSIVE GATEWAY */
            flowObject = new Gateway(flowElement.name, flowElement.id, "Exclusive", ins, outs);
        } else if (flowElement.$type == 'bpmn:Task') { /* TASKS/ACTIVITES */
            flowObject = new Activity(flowElement.name, flowElement.id, ins, outs)  
        } else if (flowElement.$type == 'bpmn:StartEvent') { /* START event */
            flowObject = new Event(flowElement.name, flowElement.id, ins, outs, "start");
        } else if (flowElement.$type == 'bpmn:EndEvent') { /* END event */
            flowObject = new Event(flowElement.name, flowElement.id, ins, outs, "end");
        } else if (flowElement.$type == 'bpmn:SequenceFlow') { /* SEQUENCE FLOW */
            flowObject = new ConnectingObject(flowElement.name, flowElement.id, "sequence", flowElement.sourceRef.id, flowElement.targetRef.id);                 
        } else if (flowElement.$type == 'bpmn:DataObjectReference') { /* DATA OBJECT */
            flowObject = new DataObject(flowElement.name, flowElement.id);                
        } else if (flowElement.$type == 'bpmn:IntermediateCatchEvent') { /* CATCHING EVENTS */
            flowObject = this.addIntermediateCatchEvent(flowElement,ins,outs);
        } else if ((flowElement.$type == 'bpmn:DataObject')) {
            flowObject = new DataObject(flowElement.name, flowElement.id);
        } else {
            console.info('Element cannot be processed: ' + flowElement.id + ', ' + flowElement.name);
        }

        /* ADDING TO THE DIAGRAM */
        if (flowObject) {
            diagram.addObject(flowObject);
        }      
    }

    /**
     * Creates intermediate catch event by its type.
     * @param {*} flowElement flow element
     * @param {*[]} ins array of incoming elements
     * @param {*[]} outs array of outgoing elements
     * @returns {*} intermediate catch event
     */
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

    /**
     * Creates ins array of incoming elements to flow element.
     * @param {*} flowElement flow element
     * @returns {*[]} ins array
     */
    static getIns(flowElement) {
        let ins = new Array();                   
        if (flowElement.incoming && typeof flowElement.incoming[Symbol.iterator] === 'function') {
            for (const inEl of flowElement.incoming) {
                ins.push(inEl.id);
            }
        }
        return ins;
    }

    /**
     * Creates out array of outgoing elements to flow element.
     * @param {*} flowElement flow element
     * @returns {*[]}  out array
     */
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
    /**
     * Loads and parses simulation data from xml file.
     * @param {string} filePath path to xml file
     * @returns {*} object loaded from file
     * @throws {Error} if file not loaded correctly
     */
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

  
    /**
     * Adds simulation data to flow elements.
     * @param {*} data data
     * @param {*} flowElement flow element
     */
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

    /**
     * Adds simulation data to one specific element.
     * @param {*} data data
     * @param {*} element one specific element
     */
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
    
    /**
     * Adds simulation general data to diagram.
     * @param {*} data data
     * @param {BPMNDiagram} diagram diagram
     */
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

    /**
     * Creates timetables and adds them to diagram.
     * @param {*} data data
     * @param {BPMNDiagram} diagram diagram
     */
    static processSimulationDataTimetables(data,diagram) {
        if (!Array.isArray(data)) {
            data = [data];
        }

        data.forEach(timetable => {
            let createdTimetable = new Timetable(timetable.name, this.convertDayToNumber(timetable.beginday), this.convertDayToNumber(timetable.endday), timetable.begintime, timetable.endtime);
            diagram.addTimetable(createdTimetable);
        });     
    }

    /**
     * Converts day to number value. Days: Mon 1, Tue 2, Wed 3, Thu 4, Fri 5, Sat 6, Sun 0
     * @param {String} day day
     * @returns {number} number value of day
     */
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
     
    /**
     * Adds simulation data to participans in diagram.
     * @param {*} participant participant
     * @param {*} data data
     */
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

    /**
     * Creates new participants from xml data, if participant does not exist already in diagram.
     * @param {*} data data
     * @param {BPMNDiagram} diagram diagram
     */
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
