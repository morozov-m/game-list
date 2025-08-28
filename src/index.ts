import './styles/styles.css';

// Сортировка
// Регистрация 
// Смена фона
// Удаление всех карточек?
// Любимые

import { EventEmitter } from "./components/base/events";
import { GameListkApi } from "./components/base/gameListApi";
import { AppData } from "./components/Model/AppData";
import { API_URL, CDN_URL } from "./untils/constants";
import { AddCardData, EditCardData, ICard } from "./types/types"
import { ensureElement, cloneTemplate, normalizeFormData } from "./untils/utils";
import { Card } from './components/View/Card';
import { Modal } from './components/View/Modal';
import { Page } from './components/View/Page';
import { FormModalView } from './components/View/FormModalView';
import { Confirm } from './components/View/Confirm';
import { FormValidator } from './components/View/Form';
import { Statistic } from './components/View/Statistic';
import { Filter } from './components/View/Filter';

const modalContainer = ensureElement<HTMLDialogElement>('.modal')
const pageContainer = ensureElement<HTMLElement>('.page')
const modalFormAddGame = cloneTemplate<HTMLFormElement>('#form-game-modal-template');
const formGame = ensureElement<HTMLFormElement>('#modal-form-game', modalFormAddGame)
const confirmContainer = cloneTemplate<HTMLElement>('#confirm')
const statisticContainer = cloneTemplate<HTMLTemplateElement>('#statistic')
const filterContainer = cloneTemplate<HTMLTemplateElement>('#filter')


const api = new GameListkApi(CDN_URL, API_URL)
const events = new EventEmitter()
const model = new AppData({}, events)
const modal = new Modal(modalContainer, events)
const page = new Page(pageContainer, events)
const formModalView = new FormModalView(formGame, events)
const confirm = new Confirm(confirmContainer, events)
const formValidator = new FormValidator(formGame, events)
const statistic = new Statistic(statisticContainer, events)
const filter = new Filter(filterContainer, events)

function openEditModal(item: ICard) {
  modal.openModal({ title: `Редактировать ${item.title}` }, formGame)
  formModalView.changeButton('editForm')
  formModalView.setInputValue(item)
}

// Загрузка каталога карточек

api.getGameCatalog()
  .then((data: ICard[]) => {
    model.setGameCatalog(data)
  })
  .catch(err => {
    console.error('Ошибка при загрузке каталога:', err);
  });

// Изменения каталога карточек

events.on<ICard[]>('catalog:change', items => {
  const cards = items.map((item, ind) => {

    const cardContainer = cloneTemplate<HTMLElement>('#card-template');

    const card = new Card(cardContainer, events, { onClick: () => events.emit('cardEdit:open', item) })

    card.setIndex(ind + 1)
    card.render(item)

    return cardContainer
  }
  )
  page.render({ catalog: cards })

  if (model.viewCatalog.length === 0 && model.filter) {
    page.changeEmptyMessege('Ничего не найдено')
  }

  else {
    page.changeEmptyMessege('Список пока пуст')
  }
  
})

// Открытие модального окна редактирования карточки

events.on<ICard>('cardEdit:open', item => {
  formValidator.clearErrors()
  formValidator.validate('edit')
  formModalView.clearInputValue()
  openEditModal(item)
  model.setSelectItem(item)
})

// Открытие модального окна добавления карточки

events.on('modalAdd:open', () => {
  formValidator.clearErrors()
  formValidator.validate('add')
  modal.openModal({ title: 'Добавить игру' }, formGame)
  formModalView.changeButton('addForm')
  formModalView.clearInputValue()
});

// Открытие модального окна удаления карточки

events.on<ICard>('confirmModal:open', () => {
  modal.openModal({ title: `Вы уверены, что хотите удалить ${model.selectItem!.title}?` }, confirmContainer)
})

// Открытие модального окна фильтрации

events.on('filter:open', () => {
  modal.openModal({title: 'Фильтр'}, filterContainer)
})

// Закрытие модального окна удаления карточки

events.on('modalConfirm:close', () => {
  openEditModal(model.selectItem!)
  formValidator.clearErrors()
})

// Открытие модального окна со статистикой

events.on('statistic:open', () => {
  modal.openModal({title: 'Статистика'}, statisticContainer)
  statistic.render({
    hours: model.getSumHours(),
    completed: model.getSumStatus('Пройдено'),
    skip: model.getSumStatus('Брошено'),
    inProgress: model.getSumStatus('В процессе')
  })
  console.log()
})

// Закрытие любого модального окна по кнопке "Отмена"

events.on('modal:close', () => {
  modal.close()
})

// Фильтрация, сортировка и поиск по названию

events.on<{filter: string, value: string}>('filter:change', ({ filter, value }) => {
  model.setFilter(filter, value);
})

// 'catalog:reverse'

events.on('catalog:reverse', () => {
  model.reverseCatalog()
})

// Отправка данных в модель при успешной валидации

events.on<{ form: 'add' | 'edit' }>('form:validate', formMode => {
  const formData = formModalView.getFormData()
  if (formMode.form === 'add') {
    const result = normalizeFormData(formData)
    model.submitForm({ mode: 'add' }, result) 
  }
  else {
    const result = {
      id: model.selectItem!.id,
      ...normalizeFormData(formData),
    }
    model.submitForm({ mode: 'edit' }, result)
  }
})

// Добавление карточки

events.on<AddCardData>('form:add:ready', data => {
  api.addGameCard({
    ...data,
    imageFile: data.imageFile
  })
    .then(newCard => {
      modal.close();
      model.addCard({
        ...newCard,
        image: `${api.cdn}/images/${newCard.image}`
      });
    })
    .catch(error => {
      console.error('Ошибка добавления карточки:', error);
    });
});

// Редактирование карточки

events.on<EditCardData & { image?: string, id: number }>('form:edit:ready', data => {
  api.updateGameCard(data, data.imageFile)
    .then(card => {
      model.changeCard(card)
      modal.close()
    })
    .catch(err => {
      console.log('не удалось обновить карточку', err)
    })
})

// Удаление карточки

events.on('delete:submit', () => {
  const card = model.selectItem
  if (card)
    api.deleteGameCard(card)
      .then(() => {
        model.deleteCard(card)
        modal.close()
      })
      .catch(err => {
        console.log('ошибка удаления', err)
      })
})







































/*import { GameListkApi } from './components/base/gameListApi';
import './styles/styles.css';
import { ICard } from './types/types';
import { CDN_URL, API_URL } from './untils/constants';
import { cloneTemplate, ensureElement } from './untils/utils';

const open = document.querySelector('.button_add') as HTMLButtonElement
const modal = document.querySelector('.modal') as HTMLDialogElement



const template = document.querySelector('#modal-add') as HTMLTemplateElement
const content = template.content.cloneNode(true)


open.addEventListener('click', () => {
     modal.showModal()
     const modalContent = modal.querySelector('.modal_content') as HTMLElement
     modalContent.appendChild(content)
})

const open = ensureElement<HTMLButtonElement>('.button_add')

const container = ensureElement<HTMLElement>('.main')


const gameListkApi = new GameListkApi(CDN_URL, API_URL)


open.addEventListener('click', () => {
        gameListkApi.addGameCard({
    image: 'gg.webp',
    title: 'Cyberpunk',
    status: 'Пройдено',
    hours: 90,
    extra: 'all dlc'
     })
     .then((data: ICard) => {

          const card = cloneTemplate<HTMLElement>('#card-template')

          const img = ensureElement<HTMLImageElement>('.card_img', card);
          const title = ensureElement<HTMLElement>('.card_title', card);
          const sub = ensureElement<HTMLElement>('.card_description', card);
          const status = ensureElement<HTMLElement>('.card_status', card);
          const hours = ensureElement<HTMLElement>('.card_total_time', card);
          const index = ensureElement<HTMLElement>('.card_number', card);

          img.src = data.image;
          title.textContent = data.title;
          sub.textContent = data.extra || null;
          status.textContent = data.status;
          hours.textContent =  String(data.hours);
          index.textContent = '1'

          container.appendChild(card)

     })
      .catch(() => {
    console.log('error');
  });
})*/