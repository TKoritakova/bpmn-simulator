import { BPMNDiagram } from '../model/BPMNDiagram';


export class BPMNAssembler {
  static buildFromDefinitions(definitions) {
    const diagram = new BPMNDiagram();
  

    if(definitions.rootElements.length > 0) {
        for (const element of definitions.rootElements) {
            if(element.hasOwnProperty('flowElements') && element.flowElements.length > 0) {
                for (const flowElement of element.flowElements) {
                    console.info('Element: ' + flowElement.id + ', ' + flowElement.name);
                }
               
            } else if(element.hasOwnProperty('messageFlows') && element.messageFlows.length > 0) {
                for (const messageFlows of element.messageFlows) {
                    console.info('Element: ' + messageFlows.id );
                }
            }
        }

    }


    return diagram;
  }
}