import { ensureAllElements, ensureElement } from "../../untils/utils"
import { IEvents } from "../base/events"
import { Component } from "./Component"

interface IPage {
    catalog: HTMLElement[]
}

export class Page extends Component<IPage> {
    protected container: HTMLElement
    protected _catalog: HTMLElement
    protected buttonAdd: HTMLButtonElement
    protected emptyMessage: HTMLElement
    protected buttonStatistic: HTMLButtonElement


    constructor(container: HTMLElement, events: IEvents) {
        super(container)

        this.container = container
        this._catalog = ensureElement<HTMLElement>('.card_catalog', container)
        this.buttonAdd = ensureElement<HTMLButtonElement>('.button_add_card', container)
        this.buttonStatistic = ensureElement<HTMLButtonElement>('.button_statistic', container)
        this.buttonStatistic.addEventListener('click', () => events.emit('statistic:open'))
        const buttonFilter = ensureElement<HTMLButtonElement>('.button_filter')
        const buttonReverse = ensureElement<HTMLButtonElement>('.button_reverse')

        
        buttonReverse.addEventListener('click', () => {
            events.emit('catalog:reverse')
        })

    
        
             ensureAllElements<HTMLInputElement>('[data-search]', container).forEach(item => {
                const evt = item.type === 'text' ? 'input' : 'change'
              item.addEventListener(evt, () => {
                  const key = item.dataset.search
                  const value = item.value
                  events.emit('filter:change', {filter: key, value})
              })
             })



        buttonFilter.addEventListener('click', () => events.emit('filter:open'))

        


        // const buttonDeleteAll = ensureElement<HTMLButtonElement>('.button_delete_all', container)

        // buttonDeleteAll.addEventListener('click', () => events.emit('confirmDeleteAll:open'))

        this.emptyMessage = ensureElement<HTMLElement>('.empty_message', container)

        this.buttonAdd.addEventListener('click', () => {
            events.emit('modalAdd:open')
        })
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.innerHTML = '';

        if (items.length !== 0) {
            this.toggleClass(this.emptyMessage, 'active', false)
            items.forEach(item => this._catalog.appendChild(item))
        }


        else {
            this.toggleClass(this.emptyMessage, 'active', true)
        }
    }

   changeEmptyMessege(value: string) {
    this.emptyMessage.textContent = value
   }

}