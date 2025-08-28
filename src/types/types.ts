export interface ICard {
  id: number;
  image: string;    // базовое имя или URL
  title: string;
  status: 'Пройдено' | 'В процессе' | 'Брошено';
  hours: number;
  extra?: string;
}

// То, что отправляем на сервер при создании новой карточки
// types.ts

export interface FormDataFields {
  title: string;
  status: ICard['status'];
  hours: number;
  extra?: string;
  imageFile?: File;
}

// Общие поля формы
export interface AddCardData {
  title: string;
  status: 'Пройдено' | 'В процессе' | 'Брошено';
  hours: number;
  extra?: string;
  imageFile: File;  // опционально на уровне всех форм
}

export interface EditCardData {
  title: string;
  status: 'Пройдено' | 'В процессе' | 'Брошено';
  hours: number;
  extra?: string;
  imageFile?: File;  // опционально на уровне всех форм
}



// export type FormErrors = Partial<Record<keyof Omit<ICard,'id'>, string>>;