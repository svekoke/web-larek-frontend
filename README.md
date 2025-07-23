# Проектная работа "Веб-ларек"

"Веб-ларек" - это интернет-магазин с товарами для веб-разработчиков. в нем можно посмотреть каталог, добавить товары в корзину и сделать заказ.

## Используемый стек

- HTML
- SCSS
- TypeScript
- Webpack
- API: https://larek-api.nomoreparties.co/api/weblarek
- CDN: https://larek-api.nomoreparties.co/content/weblarek

## Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/BasketView.ts — отображение корзины
- src/components/Card.ts — карточка товара
- src/components/CardPreview.ts — описание товара
- src/components/ContactsView.ts — контактные данные
- src/components/ModalView.ts — модальнок окно
- src/components/OrderView.ts — форма доставки и оплаты
- src/components/SuccessModal.ts — попап успешного оформления заказа
- src/components/Page.ts — компонент управления DOM-элементами
- src/components/base/ — папка с базовым кодом
- src/components/base/ProductApi.ts — API клиента

- src/models/ — модели данных
- src/models/Cart.ts — логика корзины
- src/models/Order.ts — логика заказа
- src/models/ProductModel.ts — модель товара

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами данных
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Инструкция по сборке и запуску

Необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка финальной версии

```
npm run build
```

или

```
yarn build
```

# Архитектура проекта

Приложение разделено на три основных слоя:

## 1. Данные (модели)

- Хранят бизнес-логику и данные

- Осуществляют взаимодействие с API

- Обеспечивают чистые интерфейсы для управления данными

## 2. Представления (компоненты интерфейса)

- Отвечают за работу с DOM

- Получают данные через параметры конструктора или колбэки

- Не знают, откуда приходят данные — получают через внедрение зависимостей

## 3. Экраны (контроллер логики)

- Сценарии (например, renderBasket, showOrderStep) объединяют представления и модели

- Осуществляют подписки, навигацию, вызовы API и обновление UI

## Взаимодействие между частями

- Представления взаимодействуют с моделями через функции-обработчики

- Модели не знают о DOM

- Взаимодействие между слоями реализовано через колбэки и Promise-based flow (например, в заказе)

# Базовые классы:

## Api

### Назначение:

Базовый класс для работы с API. Обеспечивает выполнение HTTP-запросов к серверу и возврат данных в формате JSON.

### Конструктор:

```
constructor(baseUrl: string, options: RequestInit = {})
```

- baseUrl – базовый URL для всех запросов (тип: string)
- options?: RequestInit — настройки запроса (по умолчанию устанавливает Content-Type: application/json).

### Поля:

```
readonly baseUrl: string
```

Базовый URL, к которому добавляются URI запросов.

```
protected options: RequestInit
```

Опции, передаваемые в fetch.

### Методы:

```
get(uri: string): Promise<object>
```

Выполняет GET-запрос по указанному URI. Возвращает Promise<object> — данные с сервера.

```
post(uri: string, data: object, method: 'POST' | 'PUT' | 'DELETE' = 'POST'): Promise<object>

```

Выполняет POST/PUT/DELETE-запрос по указанному URI с телом data. Возвращает Promise<object>.

```
protected handleResponse(response: Response): Promise<object>

```

Обрабатывает ответ от fetch. Парсит JSON, выбрасывает ошибку, если код ответа не 2xx.

## EventEmitter

### Назначение:

Универсальный класс-менеджер событий. Позволяет подписываться на события, отписываться и вызывать события с передачей данных.

### Поля:

```
private _events: Map<string | RegExp, Set<Function>>

```

Хранит все подписки. Ключ — имя события (строка или RegExp), значение — множество обработчиков.

### Методы:

```
on<T>(event: string | RegExp, callback: (data: T) => void): void
```

Подписка на событие. Поддерживает точные имена и регулярные выражения.

```
off(event: string | RegExp, callback: Function): void
```

Удаляет конкретный обработчик события.

```
emit<T>(event: string, data?: T): void
```

Вызывает все подписанные колбэки для события event, передаёт в них data.

```
onAll(callback: (event: { eventName: string, data: unknown }) => void): void

```

Подписка на все события. Передаёт в колбэк имя события и данные.

```
offAll(): void

```

Полностью очищает все подписки.

```
trigger<T>(event: string, context?: Partial<T>): (data: T) => void

```

Возвращает функцию, которая вызывает emit для события

## ProductApi

### Назначение:

Расширяет Api. Работает с конкретными маршрутами API.

### Конструктор:

```
constructor(baseUrl: string)
```

вызывает конструктор Api с базовым URL.

### Методы:

```
getProductList(): Promise<Product[]>
```

получает список товаров с сервера.

# Представления

## Card

### Назначение:

Компонент, отображающий карточку товара на главной странице.

### Конструктор:

```
constructor(product: Product, onClick: (product: Product) => void)
```

- product: Product — объект товара для отображения.

- onClick — функция, вызываемая при клике по карточке (например, для открытия превью).

### Поля:

```
private product: Product
```

объект товара.

```
private element: HTMLElement
```

DOM-элемент карточки.

```
private onClick?: (product: Product) => void
```

обработчик клика.

### Методы:

```
getElement(): HTMLElement
```

возвращает DOM-элемент карточки для вставки в интерфейс.

### Функции:

- Вставляет данные (title, price, category, image) в шаблон карточки.

- Назначает обработчик клика.

## CardPreview

### Назначение:

Компонент отображения подробного описания товара в модальном окне.

### Конструктор:

```
constructor(product: Product, onAddToCart?: (product: Product) => void)
```

- product: Product — объект товара для отображения.

- onAddToCart? — функция, вызываемая при клике на кнопку «Купить».

### Поля:

```
private product: Product
```

данные товара.

```
private element: HTMLElement
```

DOM-элемент с детальной карточкой.

```
private onAddToCart?: (product: Product) => void
```

функция добавления товара в корзину.

### Методы:

```
getElement(): HTMLElement
```

возвращает DOM-элемент компонента.

### Функции:

- Заполняет разметку: изображение, заголовок, описание, категория, цена.
- Назначает событие на кнопку «Купить».

## BasketView

### Назначение:

Компонент отображения содержимого корзины. Используется в модальном окне.

### Конструктор:

```
constructor(
  items: Product[],
  onRemove: (index: number) => void,
  onOrder: () => void
)
```

- items: Product[] — список товаров в корзине.

- onRemove — функция, вызываемая при удалении товара.

- onOrder — функция, вызываемая при оформлении заказа.

### Поля:

```
private items: Product[]
```

текущие товары в корзине.

```
private onRemove: (index: number) => void
```

колбэк удаления.

```
private onOrder: () => void
```

колбэк оформления заказа.

```
private element: HTMLElement
```

DOM-элемент компонента.

### Методы:

```
getElement(): HTMLElement
```

возвращает DOM-элемент корзины для отображения.

### Функции:

- Создаёт DOM-элементы для каждого товара.
- Назначает события на кнопки удаления.
- Подсчитывает общую сумму.
- Активирует кнопку "Оформить".

## OrderView

### Назначение:

Компонент экрана доставки и оплаты — первый шаг оформления заказа.

### Конструктор:

```
constructor(onSubmit: (data: OrderForm) => void)
```

- onSubmit — функция, вызываемая при валидной отправке формы.

### Поля:

```
private element: HTMLElement
```

DOM-элемент формы.

```
private onSubmit: (data: OrderForm) => void
```

колбэк при сабмите формы.

### Методы:

```
getElement(): HTMLElement
```

возвращает DOM-элемент компонента.

### Функции:

- Управляет переключением способа оплаты (online / при получении).
- Валидирует ввод адреса.
- Активирует кнопку "Далее" только при валидном вводе.
- Передаёт данные в Order через onSubmit.

## ContactsView

### Назначение:

Форма ввода контактных данных (email и телефон). Второй шаг оформления заказа.

### Конструктор:

```
constructor(onSubmit: (data: ContactForm) => void)
```

- onSubmit — колбэк, вызываемый при валидной отправке формы.

### Поля:

```
private element: HTMLElement
```

DOM-элемент формы.

```
private onSubmit: (data: ContactForm) => void
```

функция отправки данных.

### Методы:

```
getElement(): HTMLElement
```

возвращает DOM-элемент компонента.

### Функции:

- Ввод и валидация email и телефона.
- Активирует кнопку "Оплатить" при заполненных полях.
- Передаёт данные через onSubmit.

## Page

### Назначение:

Компонент-представление для управления DOM-элементами главной страницы (где рендерятся карточки, отображается счётчик корзины и обрабатывается кнопка её открытия).

### Конструктор:

```
constructor()
```

- При создании экземпляра класса автоматически находит и сохраняет ссылки на следующие элементы страницы

### Поля:

```
private gallery: HTMLElement
```

ссылка на контейнер .gallery, в который добавляются карточки товаров

```
private basketCounter: HTMLElement
```

ссылка на элемент .header\_\_basket-counter, в котором отображается количество товаров в корзине.

```
private basketButton: HTMLButtonElement
```

ссылка на кнопку .header\_\_basket, по нажатию на которую открывается корзина.

### Методы

```
setBasketCount(count: number): void
```

обновляет текстовое значение счётчика товаров в корзине

```
setBasketCount(count: number): void
```

заменяет содержимое галереи новым DOM-элементом (например, для обновления списка товаров)

```
setBasketClickHandler(handler: () => void): void
```

устанавливает обработчик события click на кнопку корзины

```
addCard(card: HTMLElement): void
```

добавляет одну карточку товара в конец списка в .gallery

## SuccessModal

### Назначение:

Класс SuccessModal отвечает за отображение модального окна с сообщением об успешном оформлении заказа. Устанавливает текст с суммой списанных синапсов и добавляет обработчик закрытия окна.

### Конструктор:

```
constructor(total: number, onClose: () => void)
```

- total: number — сумма заказа, отображается в тексте модального окна.
- onClose: () => void — функция, вызываемая при клике на кнопку закрытия.

### Поля:

```
private element: HTMLElement
```

DOM-элемент модального окна, созданный из шаблона #success.

```
private sumElement: HTMLElement
```

Элемент .order-success\_\_description, в который вставляется текст с суммой заказа.

```
private closeButton: HTMLButtonElement
```

Кнопка .order-success\_\_close, закрывающая окно. Назначается обработчик onClose.

### Методы:

```
getElement(): HTMLElement
```

Возвращает DOM-элемент модального окна, который можно передать в ModalView.open().

## ModalView

### Назначение:

Компонент управления модальным окном. Отвечает за отображение, скрытие и замену содержимого модального окна. Не наследуется ни от какого базового класса.

### Конструктор:

```
constructor()
```

- Получение шаблона #modal
- Клонирование DOM-элемента модального окна .modal
- Сохраняются ссылки на .modal**close, .modal**content, .modal и .modal\_\_container.
- Назначаются обработчики закрытия по кнопке и клику на оверлей.

### Поля:

```
private element: HTMLElement
```

корневой DOM-элемент модального окна.

```
private content: HTMLElement
```

контейнер для вставки содержимого.

```
private closeButton: HTMLElement
```

кнопка закрытия.

```
private overlay: HTMLElement
```

фон-оверлей для закрытия по клику.

```
private container: HTMLElement
```

.modal\_\_container, служит для захвата кликов внутри модалки.

### Методы:

```
open(content: HTMLElement): void
```

Открывает модальное окно и вставляет переданный DOM-элемент content внутрь.

```
close(): void
```

Закрывает модальное окно, очищает его содержимое.

```
render(content: HTMLElement): void
```

Вставляет переданный HTMLElement в контейнер .modal\_\_content.

```
setEventListeners(): void
```

Назначает обработчики событий: закрытие по кнопке и оверлею.

```
getElement(): HTMLElement
```

Возвращает DOM-элемент модального окна (например, для вставки в документ при инициализации).

# Модели данных

## Cart

### Назначение:

Управляет товарами в корзине: добавление, удаление, подсчёт суммы и количества.

### Конструктор:

```
constructor()
```

- создаёт пустую корзину.

### Поля:

```
items: Product[]
```

список товаров в корзине.

### Методы:

```
add(item: Product): void
```

добавляет товар в корзину.

```
remove(index: number): void
```

удаляет товар по индексу.

```
getItems(): Product[]
```

возвращает список товаров.

```
getTotal(): number
```

возвращает сумму всех товаров.

```
getCount(): number
```

возвращает количество товаров.

```
clear(): void
```

очищает корзину.

## Order

### Назначение:

Сохраняет и управляет текущим заказом.

### Конструктор:

```
constructor()
```

инициализирует пустой заказ.

### Поля:

```
items: Product[]
```

товары заказа.

```
form: OrderForm
```

способ оплаты и адрес.

```
contacts: ContactForm
```

email и телефон клиента.

### Методы:

```
setItems(items: Product[]): void
```

сохраняет товары.

```
setForm(data: OrderForm): void
```

сохраняет способ оплаты и адрес.

```
setContacts(data: ContactForm): void
```

сохраняет контактные данные.

```
getOrderData(): OrderRequest
```

возвращает заказ для API.

```
clear(): void
```

очищает данные заказа.

## ProductModel

### Назначение:

Оборачивает данные товара, полученного с сервера.

### Конструктор:

```
constructor(data: Product)
```

принимает объект товара.

### Поля:

```
data: Product
```

товарные данные.

### Методы:

```
getData(): Product
```

возвращает товар.

# Типы данных (src/types/index.ts)

```
export type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
};

export type ApiListResponse<T> = {
  total: number;
  items: T[];
};

export type OrderForm = {
  payment: string; // "card" или "cash"
  address: string;
};

export type ContactForm = {
  email: string;
  phone: string;
};

export type OrderRequest = {
  items: string[]; // массив id товаров
} & OrderForm & ContactForm;
```
