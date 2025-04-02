// src/bpmn/BPMNLoader.js
import BpmnModdle from 'bpmn-moddle';
import { BPMNDiagramBuilder } from './bpmn-model/builders/BPMNDiagramBuilder';

const moddle = new BpmnModdle();

/**
 * Načte BPMN XML soubor a vytvoří BPMNDiagram instanci pomocí builderu
 * @param {File} file – BPMN XML soubor (File z inputu)
 * @returns {Promise<BPMNDiagram>}
 */
export async function loadBPMNFromFile(file) {
  const xml = await file.text();

  return moddle.fromXML(xml).then(({ rootElement }) => {
    const builder = new BPMNDiagramBuilder();

    const process = rootElement.rootElements.find(e => e.$type === 'bpmn:Process');
    if (!process) throw new Error('No <bpmn:Process> found in BPMN file');

    // procházení flow elementů
    process.flowElements.forEach(el => {
      switch (el.$type) {
        case 'bpmn:Task':
          builder.addActivity({
            id: el.id,
            description: el.name || 'Neznámá aktivita',
            duration: 1.0, // defaultní nebo z vlastních extension tagů
            x: 0,
            y: 0
          });
          break;

        case 'bpmn:ExclusiveGateway':
        case 'bpmn:ParallelGateway':
          builder.addGateway({
            id: el.id,
            description: el.name || 'Gateway',
            type: el.$type === 'bpmn:ExclusiveGateway' ? 'exclusive' : 'parallel',
            x: 0,
            y: 0
          });
          break;

        // můžeš přidat další typy (Eventy atd.)
      }
    });

    return builder.build();
  });
}
