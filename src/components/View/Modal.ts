import { ICard } from "../../types/types";
import { ensureElement } from "../../untils/utils";
import { IEvents } from "../base/events";
import { Component } from "./Component";

interface ModalData {
    title: string
}

export class Modal extends Component<ModalData> {
    protected container: HTMLDialogElement
    protected modalContent: HTMLElement
    protected iconClose: HTMLElement
    protected modalTitle: HTMLElement
    protected events: IEvents
  
   


    constructor(container: HTMLDialogElement, events: IEvents) {
        super(container)

        this.container = container
        this.events = events
        this.iconClose = ensureElement<HTMLElement>('.modal_close', container)
        this.modalContent = ensureElement<HTMLElement>('.modal_content', container)
        this.modalTitle = ensureElement<HTMLElement>('.modal_title', container)

  

        this.iconClose.addEventListener('click', () => {
            this.close()
        })



    }

    set title(value: string) {
        this.modalTitle.textContent = value

    }


 private   open(): void {
        this.container.showModal()
    }

    close(): void {
        this.container.close()
      
    }

  private  renderModal(data: Partial<ModalData>, container: HTMLElement): HTMLDialogElement {
        super.render(data)
        this.modalContent.innerHTML = ''
        this.modalContent.appendChild(container)
        return this.container
    }


   openModal(data: Partial<ModalData>, container: HTMLElement) {
    this.open()
    this.renderModal(data, container)
   }
 



}