import { IEvents } from "../base/events"

export abstract class Model<T> {
    data: Partial<T>
    events: IEvents
   

    constructor(data: Partial<T>, events: IEvents) {
        this.data = data
        this.events = events
    }


    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }

}