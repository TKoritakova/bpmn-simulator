import FIFO from 'fifo';

export class BPMNSimulator {
  constructor(maxSteps) {
    this.queue = new FIFO();  // Fronta pro úkoly
    this.simulationRunning = false;
    this.maxSteps = maxSteps;  
    this.stepsExecuted = 0;    
  }

  startSimulation(diagram, onUpdate) {
    if (this.simulationRunning) return;
    this.simulationRunning = true;
    this.stepsExecuted = 0;

    diagram.getAllObjects().forEach(element => {
      if (element.constructor.name === "Event" && element.type === "start") {
        this.queue.push(element);  
      }
    });

    this.processQueue(onUpdate, diagram);
  }

 
  stopSimulation() {
    this.simulationRunning = false;
    console.log('Simulace zastavena');
  }

  
  async processQueue(onUpdate, diagram) {
    while (this.queue.length > 0 && this.simulationRunning && this.stepsExecuted < this.maxSteps) {
      const currentTask = this.queue.shift();  
      this.stepsExecuted++;
      console.log(`Minuta ${this.stepsExecuted}: Zpracovávám úkol: ${currentTask.ID}, name: ${currentTask.description}`);

      // Zpracování podle typu úkolu
      /*if (currentTask === 'bpmn:Task') {
        console.log(`Úkol ${currentTask.ID} vykonán.`);
      } else if (currentTask.$type === 'bpmn:EndEvent') {
        console.log(`Úkol ${currentTask.ID} - Simulace skončila.`);
        this.stopSimulation();  // Konec simulace
        return;
      }*/

      
                       
    // Zkontroluj, zda existují a jsou iterovatelné 'outs'
    if (Array.isArray(currentTask.outs) && currentTask.outs.length > 0) {
      currentTask.outs.forEach(element => {
        this.queue.push(element.target);
      });   
  
    }
      
    
      // Zavolání callbacku pro aktualizaci
      if (onUpdate) {
        onUpdate(this.stepsExecuted);
      }

      // Simulace čekání na nějaký čas (pokud by to bylo potřeba)
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulace zpoždění 0.5 sekundy
    }

    if (this.stepsExecuted >= this.maxSteps) {
      console.log(`Simulace dokončena po ${this.maxSteps} krocích.`);
      this.stopSimulation();
    } else if (this.queue.length === 0) {
      console.log("Simulace dokončena, fronta je prázdná.");
      this.stopSimulation();
    }
  }
}
