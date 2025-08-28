import { AddCardData, EditCardData, ICard } from "../../types/types";
import { Api, ApiListResponse } from "./api";


export class GameListkApi extends Api {
    cdn: string

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options)
        this.cdn = cdn
    }

    getGameCatalog(): Promise<ICard[]> {
        return this.get<ICard[]>('/games')
            .then(items =>
                items.map(item => ({
                    ...item,
                    image: `${this.cdn}/images/${item.image}`
                }))
            );
    }

    deleteGameCard(card: ICard): Promise<void> {
        return this.delete(`/games/${card.id}`);
    }



addGameCard(data: AddCardData): Promise<ICard> {
  const fd = new FormData();
  fd.append('title', data.title);
  fd.append('status', data.status);
  fd.append('hours', String(data.hours));
  if (data.extra) fd.append('extra', data.extra);
  fd.append('image', data.imageFile);

  return fetch(`${this.baseUrl}/games`, {
    method: 'POST',
    body: fd,
  })
    .then(res => res.json())
    .then(item => ({
      ...item,
      image: item.image, // имя файла от сервера
    }));
}

    updateGameCard(
        card: EditCardData & { image?: string, id: number },
        file?: File
    ): Promise<ICard> {
        // если есть файл, нужно отправить multipart/form-data
        if (file) {
            const form = new FormData();
            form.append('image', file);
            form.append('title', card.title);
            form.append('status', card.status);
            form.append('hours', String(card.hours));
            form.append('extra', card.extra ?? '');

            return fetch(`${this.baseUrl}/games/${card.id}`, {
                method: 'PUT',
                body: form
            })
                .then(res => {
                    if (!res.ok) throw new Error(res.statusText);
                    return res.json() as Promise<ICard>;
                })
                .then(item => ({
                    ...item,
                    image: `${this.cdn}/images/${item.image}`
                }));
        }

        // без файла — можно отправить JSON (тогда сервер JSON-парсер)
        return this.post<ICard>(
            `/games/${card.id}`,
            {
                title: card.title,
                status: card.status,
                hours: card.hours,
                extra: card.extra
            },
            'PUT'
        ).then(item => ({
            ...item,
            image: `${this.cdn}/images/${item.image}`
        }));
    }
}