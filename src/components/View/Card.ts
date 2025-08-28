import { ICard } from "../../types/types";
import { ensureElement } from "../../untils/utils";
import { IEvents } from "../base/events";
import { Component } from "./Component";

export interface IActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement
    protected _image: HTMLImageElement
    protected _extra: HTMLElement
    protected _status: HTMLElement
    protected _hours: HTMLElement
    protected _index: HTMLElement
    protected overlay: HTMLElement

    constructor(container: HTMLElement, events: IEvents, actions?: IActions) {
        super(container)

        this._title = ensureElement<HTMLElement>('.card_title', container)
        this._image = ensureElement<HTMLImageElement>('.card_img', container)
        this._extra = ensureElement<HTMLElement>('.card_description', container)
        this._status = ensureElement<HTMLElement>('.card_status', container)
        this._hours = ensureElement<HTMLElement>('.card_total_time', container)
        this._index = ensureElement<HTMLElement>('.card_number', container)
        this.overlay = ensureElement<HTMLElement>('.img_container', container)


        if (actions?.onClick) {
            this.overlay.addEventListener('click', actions.onClick)
        }

        

    }

    set title(value: string) {
        this._title.textContent = value
    }

    set image(value: string) {
        this._image.src = value
        this._image.alt = ''
    }

    set extra(value: string) {
        this._extra.textContent = value ?? ''
    }

    set status(value: string) {
        this._status.textContent = value
        if (value  === 'Пройдено') {
            this._status.style.color = 'green'
        }

        else if (value === 'В процессе') {
            this._status.style.color = 'rgb(75, 201, 255)'
        } 

        else if (value === 'Брошено') {
            this._status.style.color = 'rgb(155, 0, 0)'

        }
    }

    set hours(value: string) {
        this._hours.textContent = value
    }

    setIndex(value: number) {
        this._index.textContent = String(value)
    }

} 