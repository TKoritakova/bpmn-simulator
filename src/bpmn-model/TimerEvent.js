import { Event } from './Event.js';

export class TimerEvent extends Event {
  constructor(description, duration, ID) {
    super(description, duration, ID);
  }

  execute() {
    console.log(`Timer event: ${this.description}`);
  }
}