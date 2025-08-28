import { ensureElement } from "../../untils/utils";
import { IEvents } from "../base/events";

export class Confirm {


    constructor(container: HTMLElement, events: IEvents) {
        const cancelButton = ensureElement<HTMLButtonElement>('.button_cancel', container)
        const deleteButton = ensureElement<HTMLButtonElement>('.button_delete', container)

        cancelButton.addEventListener('click', () => events.emit('modalConfirm:close'))
        deleteButton.addEventListener('click', () => events.emit('delete:submit'))


    }
}