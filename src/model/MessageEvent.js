import { Event } from './Event.js';

export class MessageEvent extends Event {
  constructor(description, duration, ID) {
    super(description, duration, ID);
  }

  execute() {
    console.log(`Message event: ${this.description}`);
  }
}