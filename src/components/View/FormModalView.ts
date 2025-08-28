
import { ICard } from "../../types/types";
import { ensureElement } from "../../untils/utils"
import { IEvents } from "../base/events"




type ChangeButton = 'addForm' | 'editForm'

export class FormModalView {
    protected container: HTMLFormElement
    protected addButton: HTMLButtonElement;
    protected deleteButton: HTMLButtonElement;
    protected cancelButton: HTMLButtonElement;
    protected saveButton: HTMLButtonElement;



    constructor(container: HTMLFormElement, events: IEvents) {

        this.container = container

        this.addButton = ensureElement<HTMLButtonElement>('.button_add', container)
        this.cancelButton = ensureElement<HTMLButtonElement>('.button_cancel', container)
        this.deleteButton = ensureElement<HTMLButtonElement>('.button_delete', container)
        this.saveButton = ensureElement<HTMLButtonElement>('.button_save', container)


    
        this.deleteButton.addEventListener('click', () => events.emit('confirmModal:open'))
      
     //   this.saveButton.addEventListener('click', () => events.emit('form:validate', {form: 'edit'}))

        this.cancelButton.addEventListener('click', () => events.emit('modal:close'))


       // this.addButton.addEventListener('click', () => events.emit('form:validate', {form: 'add'}))
    }


    setInputValue(data: ICard) {

      
        (this.container.elements.namedItem('title') as HTMLInputElement).value = data.title;
        (this.container.elements.namedItem('status') as HTMLSelectElement).value = data.status;
        (this.container.elements.namedItem('hours') as HTMLInputElement).value = String(data.hours);
        (this.container.elements.namedItem('extra') as HTMLInputElement).value = data.extra || '';



    }

    clearInputValue() {
        this.container.reset()
    }

    getFormData() {
        const formData = new FormData(this.container)
        return Object.fromEntries(formData.entries());
    }

    
    changeButton(value: ChangeButton) {
        this.deleteButton.style.display = value === 'addForm' ? 'none' : 'block'
        this.cancelButton.style.display = value === 'editForm' ? 'none' : 'block'
        this.addButton.style.display = value === 'editForm' ? 'none' : 'block'
        this.saveButton.style.display = value === 'addForm' ? 'none' : 'block'
    }

    

}