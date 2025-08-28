import { ensureElement } from "../../untils/utils";
import { IEvents } from "../base/events";
import { Component } from "./Component";


interface IStatistic {
    hours: number,
    completed: number,
    skip: number,
    inProgress: number
}


export class Statistic extends Component<IStatistic> {
    protected cancelButton: HTMLButtonElement;
    protected hoursItem: HTMLElement;
    protected completedItem: HTMLElement;
    protected skipItem: HTMLElement;
    protected inProgressItem: HTMLElement;



    constructor(container: HTMLTemplateElement, events: IEvents) {
        super(container)

                this.cancelButton = ensureElement<HTMLButtonElement>('.button_cancel', container)
        this.cancelButton.addEventListener('click', () => events.emit('modal:close'))

                this.hoursItem = ensureElement<HTMLButtonElement>('.hours', container)
                this.completedItem = ensureElement<HTMLButtonElement>('.completed', container)

                this.skipItem = ensureElement<HTMLButtonElement>('.skip', container)

                this.inProgressItem = ensureElement<HTMLButtonElement>('.in_progress', container)
    }

    set hours(value: number) {
        this.hoursItem.textContent = `Всего потрачено часов: ${String(value)}` 
    }

    set completed(value: number) {
        this.completedItem.textContent = `Пройденных игр: ${String(value)}` 
    }

    set skip(value: number) {
        this.skipItem.textContent = `Брошенных игр: ${String(value)}` 
    }

     set inProgress(value: number) {
        this.inProgressItem.textContent = `В процессе: ${String(value)}` 
    }


}