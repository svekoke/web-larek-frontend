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
- src/components/base/ — папка с базовым кодом

- src/models/ — модели данных
- src/models/Cart.ts — логика корзины
- src/models/Order.ts — логика заказа
- src/models/ProductApi.ts — API клиента
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

## Архитектура проекта

Приложение разделено на три основных слоя:

# 1. Данные (модели)

- Хранят бизнес-логику и данные

- Осуществляют взаимодействие с API

- Обеспечивают чистые интерфейсы для управления данными

# 2. Представления (компоненты интерфейса)

- Отвечают за работу с DOM

- Получают данные через параметры конструктора или колбэки

- Не знают, откуда приходят данные — получают через внедрение зависимостей

# 3. Экраны (контроллер логики)

- Сценарии (например, renderBasket, showOrderStep) объединяют представления и модели

- Осуществляют подписки, навигацию, вызовы API и обновление UI

# Взаимодействие между частями

- Представления взаимодействуют с моделями через функции-обработчики

- Модели не знают о DOM

- Взаимодействие между слоями реализовано через колбэки и Promise-based flow (например, в заказе)

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

Описание классов будет представлено далее по разделам: Базовые, Модели, Представления

## Базовые классы

## Api

# Назначение:

Базовый класс для работы с API. Обеспечивает выполнение HTTP-запросов к серверу и возврат данных в формате JSON.

# Конструктор:

```
constructor(baseUrl: string)
```

baseUrl – базовый URL для всех запросов (тип: string)

# Поля:

```
baseUrl: string
```

URL, к которому выполняются все HTTP-запросы.

# Методы:

```
get<T>(uri: string): Promise<T>
```

отправляет GET-запрос по указанному пути uri, возвращает данные типа T.

```
post<T>(uri: string, data: unknown): Promise<T>
```

отправляет POST-запрос с телом data, возвращает данные типа T.

## EventEmitter

# Назначение:

Универсальный класс-менеджер событий. Позволяет подписываться на события, отписываться и вызывать события с передачей данных.

# Поля:

listeners: Record<string, Function[]> — объект с массивами обработчиков для каждого события.

# Методы:

```
on(event: string, handler: Function): void
```

добавляет подписку на событие.

```
off(event: string, handler: Function): void
```

удаляет обработчик события.

```
emit(event: string, data?: unknown): void
```

вызывает все обработчики события и передаёт им данные.

## Cart

# Назначение:

Управляет товарами в корзине: добавление, удаление, подсчёт суммы и количества.

# Конструктор:

```
constructor()
```

создаёт пустую корзину.

# Поля:

```
items: Product[]
```

список товаров в корзине.

# Методы:

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

# Назначение:

Сохраняет и управляет текущим заказом.

# Конструктор:

```
constructor()
```

инициализирует пустой заказ.

# Поля:

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

# Методы:

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

# Назначение:

Оборачивает данные товара, полученного с сервера.

# Конструктор:

```
constructor(data: Product)
```

принимает объект товара.

# Поля:

```
data: Product
```

товарные данные.

# Методы:

```
getData(): Product
```

возвращает товар.

## ProductApi

# Назначение:

Расширяет Api. Работает с конкретными маршрутами API.

# Конструктор:

```
constructor(baseUrl: string)
```

вызывает конструктор Api с базовым URL.

# Методы:

```
getProductList(): Promise<Product[]>
```

получает список товаров с сервера.

## Представления

## Card

# Назначение:

Компонент, отображающий карточку товара на главной странице.

# Конструктор:

```
constructor(product: Product, onClick: (product: Product) => void)
```

product: Product — объект товара для отображения.

```
onClick
```

функция, вызываемая при клике по карточке (например, для открытия превью).

# Поля:

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

# Методы:

```
getElement(): HTMLElement
```

возвращает DOM-элемент карточки для вставки в интерфейс.

# Функции:

- Вставляет данные (title, price, category, image) в шаблон карточки.

- Назначает обработчик клика.

## CardPreview

# Назначение:

Компонент отображения подробного описания товара в модальном окне.

# Конструктор:

```
constructor(product: Product, onAddToCart?: (product: Product) => void)
```

- product: Product — объект товара для отображения.

- onAddToCart? — функция, вызываемая при клике на кнопку «Купить».

# Поля:

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

# Методы:

```
getElement(): HTMLElement
```

возвращает DOM-элемент компонента.

# Функции:

- Заполняет разметку: изображение, заголовок, описание, категория, цена.
- Назначает событие на кнопку «Купить».

## BasketView

# Назначение:

Компонент отображения содержимого корзины. Используется в модальном окне.

# Конструктор:

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

# Поля:

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

# Методы:

```
getElement(): HTMLElement
```

возвращает DOM-элемент корзины для отображения.

# Функции:

- Создаёт DOM-элементы для каждого товара.
- Назначает события на кнопки удаления.
- Подсчитывает общую сумму.
- Активирует кнопку "Оформить".

## OrderView

# Назначение:

Компонент экрана доставки и оплаты — первый шаг оформления заказа.

# Конструктор:

```
constructor(onSubmit: (data: OrderForm) => void)
```

- onSubmit — функция, вызываемая при валидной отправке формы.

# Поля:

```
private element: HTMLElement
```

DOM-элемент формы.

```
private onSubmit: (data: OrderForm) => void
```

колбэк при сабмите формы.

# Методы:

```
getElement(): HTMLElement
```

возвращает DOM-элемент компонента.

# Функции:

- Управляет переключением способа оплаты (online / при получении).
- Валидирует ввод адреса.
- Активирует кнопку "Далее" только при валидном вводе.
- Передаёт данные в Order через onSubmit.

## ContactsView

# Назначение:

Форма ввода контактных данных (email и телефон). Второй шаг оформления заказа.

# Конструктор:

```
constructor(onSubmit: (data: ContactForm) => void)
```

- onSubmit — колбэк, вызываемый при валидной отправке формы.

# Поля:

```
private element: HTMLElement
```

DOM-элемент формы.

```
private onSubmit: (data: ContactForm) => void
```

функция отправки данных.

# Методы:

```
getElement(): HTMLElement
```

возвращает DOM-элемент компонента.

# Функции:

- Ввод и валидация email и телефона.
- Активирует кнопку "Оплатить" при заполненных полях.
- Передаёт данные через onSubmit.

## ModalView

# Назначение:

Компонент управления модальным окном. Отвечает за отображение, скрытие и замену содержимого модального окна. Не наследуется ни от какого базового класса.

# Конструктор:

```
constructor()
```

- Получение шаблона #modal
- Клонирование DOM-элемента модального окна .modal
- Сохраняются ссылки на .modal**close, .modal**content, .modal и .modal\_\_container.
- Назначаются обработчики закрытия по кнопке и клику на оверлей.

# Поля:

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

# Методы:

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
