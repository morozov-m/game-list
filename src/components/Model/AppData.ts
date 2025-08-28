import { Model } from "./Model";
import { AddCardData, EditCardData, ICard } from "../../types/types";
import { IEvents } from "../base/events";


export class AppData extends Model<ICard> {
  reverseViewCatalog: boolean = false
  private filters: {
    title: string,
    sort: string,
    hoursMore: number,
    hoursUnder: number,
    status: string,
    [key: string]: any;
  } = {
      title: '',
      sort: '',
      hoursMore: 0,
      hoursUnder: 0,
      status: '',
    };
  fullCatalog: ICard[] = []
  viewCatalog: ICard[] = []
  protected formData: Partial<AddCardData> | Partial<EditCardData> = {}
  selectItem: ICard | null = null

  constructor(initialData: Partial<ICard>, events: IEvents) {
    super(initialData, events);
  }

  setFilter<K extends keyof typeof this.filters>(key: K, value: typeof this.filters[K]) {
    this.filters[key] = value;
    this.applyFilter();
  }

  setGameCatalog(data: ICard[]): void {
    this.fullCatalog = data;
    this.viewCatalog = this.fullCatalog.slice()
    this.emitChanges('catalog:change', this.viewCatalog);
  }


  get filter(): boolean {
    return Object.values(this.filters).some(item => Boolean(item))
  }


  submitForm(modeSubmit: { mode: 'add' | 'edit' }, data: AddCardData | EditCardData) {
    this.formData = data
    if (modeSubmit.mode === 'add' && this.validateAddForm()) {
      this.events.emit('form:add:ready', this.formData)
    }
    else if (modeSubmit.mode === 'edit' && this.validateEditForm()) {
      this.events.emit('form:edit:ready', this.formData)
    }
  }

  validateAddForm(): boolean {
    if (this.formData.hours === undefined || this.formData.title === undefined || this.formData.imageFile === undefined) {
      return false
    }
    else {
      return true
    }
  }

  validateEditForm(): boolean {
    if (this.formData.hours === undefined || this.formData.title === '') {
      return false
    }
    else {
      return true
    }
  }

  addCard(card: ICard) {
    this.fullCatalog.push(card)
    this.applyFilter();
  }

  setSelectItem(card: ICard) {
    this.selectItem = card
  }

  deleteCard(card: ICard) {
    if (this.fullCatalog.length === 1 && this.fullCatalog[0].id === card.id) {
      this.fullCatalog = [];
    } else {
      this.fullCatalog = this.fullCatalog.filter(item => item.id !== card.id);
    }
    this.applyFilter()
  }

  changeCard(card: ICard): void {
    const idx = this.fullCatalog.findIndex(i => i.id === card.id);
    if (idx !== -1) {
      this.fullCatalog[idx] = card;
    }
    this.applyFilter();
  }

  getSumHours(): number {
    return this.viewCatalog.reduce((sum, item) => sum + item.hours, 0)
  }

  getSumStatus(value: 'Пройдено' | 'Брошено' | 'В процессе'): number {
    const arr = this.viewCatalog.filter(item => item.status === value)
    return arr.length
  }

  reverseCatalog() {
    this.reverseViewCatalog = !this.reverseViewCatalog
    this.applyFilter()
  }

  private applyFilter(): void {
    // Начинаем с полного списка
    let result = this.fullCatalog.slice();

    // 1) Фильтрация по названию (searchValue)
    if (this.filters.title) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(this.filters.title.trim().toLowerCase())
      );
    }


    if (this.filters.sort === 'По часам') {
      result = result.sort((a, b) => b.hours - a.hours)
    }


    // 2) Фильтрация по статусу (searchStatus)
    if (this.filters.status) {
      result = result.filter(item =>
        item.status === this.filters.status
      );
    }

    if (this.filters.hoursMore) {
      result = result.filter(item =>
        item.hours > this.filters.hoursMore
      )
    }

    if (this.filters.hoursUnder) {
      result = result.filter(item =>
        item.hours < this.filters.hoursUnder
      )
    }

    if (this.reverseViewCatalog) {
      result.reverse()
    }

    // 3) Сохраняем и эмитим
    this.viewCatalog = result;
    this.emitChanges('catalog:change', this.viewCatalog);
  }
}