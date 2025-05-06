import { Activity } from "../model/Activity";
import { Gateway } from "../model/Gateway";
import { Event } from "../model/Event";
import { MessageEvent } from "../model/MessageEvent";
import { TimerEvent } from "../model/TimerEvent";
import { ConnectingObject } from "../model/ConnectingObject";
import { DataObject } from "../model/DataObject";
import { Participant } from "../model/Participant";



export function deserializeBPMNObject(data) {
    switch (data.type) {
        case 'Activity': return Activity.fromSerializableObject(data);
        case 'Gateway': return Gateway.fromSerializableObject(data);
        case 'Event': return Event.fromSerializableObject(data);
        case 'MessageEvent': return MessageEvent.fromSerializableObject(data);
        case 'TimerEvent': return TimerEvent.fromSerializableObject(data);
        case 'ConnectingObject': return ConnectingObject.fromSerializableObject(data);
        case 'DataObject': return DataObject.fromSerializableObject(data);
        case 'Participant': return Participant.fromSerializableObject(data);
        default:
          throw new Error(`Neznámý typ objektu: ${data.type}`);
      }
  }