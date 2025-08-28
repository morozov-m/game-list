export type ApiListResponse<Type> = {
  total: number;
  items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
  readonly baseUrl: string;
  protected options: RequestInit;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as object ?? {}),
      },
    };
  }

  // Универсальный парсер ответа в нужный тип T
  protected async handleResponse<T>(response: Response): Promise<T> {
    const payload = await response.json();
    if (!response.ok) {
      // Если сервер вернул ошибку — бросаем
      throw new Error(payload.error ?? response.statusText);
    }
    return payload as T;
  }

  // GET-запрос, возвращает Promise<T>
  async get<T>(uri: string): Promise<T> {
    const response = await fetch(this.baseUrl + uri, {
      ...this.options,
      method: 'GET',
    });
    return this.handleResponse<T>(response);
  }

  // POST/PUT/DELETE, возвращает Promise<T>
  async post<T>(
    uri: string,
    data: object,
    method: ApiPostMethods = 'POST'
  ): Promise<T> {
    const response = await fetch(this.baseUrl + uri, {
      ...this.options,
      method,
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  delete(uri: string): Promise<void> {
  return fetch(this.baseUrl + uri, {
    ...this.options,
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error ?? response.statusText);
      });
    }
    return;
  });
}

}
