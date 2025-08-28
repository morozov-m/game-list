export abstract class Component<T> {
    protected container: HTMLElement

    constructor(container: HTMLElement) {
        this.container = container
    }

    toggleClass(element: HTMLElement, className: string, state: boolean): void {
        if (state) {
            element.classList.add(className)
        }

        else {
            element.classList.remove(className)
        }
    }

    setText(element: HTMLElement, value: unknown): void {
        element.textContent = String(value)
    }

    setImage(element: HTMLImageElement, src: string, alt: string): void {
        element.src = src
        element.alt = alt
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data);
        return this.container;
    }
}