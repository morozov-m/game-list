import { ensureAllElements, ensureElement } from "../../untils/utils";
import { IEvents } from "../base/events";

export class Filter {
    constructor(container: HTMLElement, events: IEvents) {


     ensureAllElements<HTMLInputElement>('[data-filter]', container).forEach(item => {
        const evt = item.type === 'number' ? 'input' : 'change'
      item.addEventListener(evt, () => {
          const key = item.dataset.filter
          const value = item.value
          events.emit('filter:change', {filter: key, value})
      })
     })


                const cancelButton = ensureElement<HTMLButtonElement>('.button_cancel', container)
        cancelButton.addEventListener('click', () => events.emit('modal:close'))
    }
}