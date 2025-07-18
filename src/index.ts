import './scss/styles.scss';

//  импорты
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Catalog } from './models/Catalog';
import { Cart } from './models/Cart';
import { Order } from './models/Order';
import { ProductItem, ApiListResponse, CartState } from './types/index';
import { ModalView } from './components/ModalView';
import { CartView } from './components/CartView';
import { OrderView } from './components/OrderView';
import { API_URL, CDN_URL } from '../src/utils/constants';

//  объект api
const api = new Api(API_URL);

//  объект событий
const events = new EventEmitter();

//  экземпляр моделей
const catalog = new Catalog(events);
const cart = new Cart(events);
const order = new Order(events);

//  для модалки
let modal: ModalView | null = null;

//  для корзины видимой
const cartView = new CartView('.header__basket-counter');

//  отслеживание события добавления товара в корзину
events.on('cart:update', (state: CartState) => {
	cartView.render(state);
});

//  загрузка списка товаров с сервера
api
	.get('/product')
	.then((res: { items: ProductItem[] }) => {
		catalog.setCatalog(res.items);
	})
	.catch((err) => {
		console.error('Ошибка при загрузке товаров:', err);
	});

//  отрисовка каталога
function renderCatalog(items: ProductItem[]) {
	const container = document.querySelector('.gallery');
	if (container) {
		container.innerHTML = ''; // очистить

		//  создание div для каждого товара (картинка, название, цена)
		items.forEach((item) => {
			const el = document.createElement('div');
			el.className = 'product-card';
			el.innerHTML = `
				<img src="${CDN_URL + item.image}" alt="${item.title}">
				<h3>${item.title}</h3>
				<p>${item.price ?? 0} ₽</p>
				<button>Подробнее</button>
			`;

			//  кнопка "подробнее" сохраняет товар выбранным
			el.querySelector('button')?.addEventListener('click', () => {
				catalog.setPreview(item);
			});

			//  добавление карточки на страницу
			container.appendChild(el);
		});
	}
}

// обновление каталога при добавлении товара
events.on('catalog:update', renderCatalog);

//  для формы в модалке
document.addEventListener('DOMContentLoaded', () => {
	const basketButton = document.querySelector('.header__basket');
	if (basketButton) {
		basketButton.addEventListener('click', () => {
			const orderView = new OrderView(events);
			modal = new ModalView(
				orderView.render() as any,
				() => {}, // onAddToCart
				() => {
					// onClose
					modal?.destroy();
					modal = null;
				}
			);
		});
	} else {
		console.error("Кнопка корзины не найдена");
	}
});

//  события для формы
events.on<{ value: string }>('order.payment', (data) => {
	order.setField('paymentType', data.value);
});

events.on<{ value: string }>('order.address', (data) => {
	order.setField('address', data.value);
});

//  валидация для формы
events.on('order.submit', () => {
	const isValid = order.validate();

	if (isValid) {
		//  открыть следующую форму (contacts)
		console.log('Адрес и способ оплаты валидны');
		//  открыть contactsView здесь
	}
});

//  РЕНДЕР ФОРМЫ!!!
events.on('order.submit', () => {
	const isValid = order.validate();
	if (isValid) {
		const cartState = cart.getState();
		order.attachProducts(cartState.ids, cartState.sum);

		//  отображение формы контактов:
		const contactsTemplate = document.querySelector<HTMLTemplateElement>('#contacts');
		if (contactsTemplate) {
			const contactsForm = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;

			contactsForm.addEventListener('submit', (e) => {
				e.preventDefault();

				const email = (
					contactsForm.querySelector('input[name="email"]') as HTMLInputElement
				).value;
				const phone = (
					contactsForm.querySelector('input[name="phone"]') as HTMLInputElement
				).value;

				order.setField('contact.email', email);
				order.setField('contact.phone', phone);

				if (order.validate()) {
					api
						.post('/order', order.getOrder())
						.then((response) => {
							console.log('Заказ отправлен:', response);

							const success = document
								.querySelector<HTMLTemplateElement>('#success')!
								.content.firstElementChild!.cloneNode(true) as HTMLElement;

							modal = new ModalView(
								success,
								() => {},
								() => {
									modal?.destroy();
									modal = null;
								}
							);

							modal.show();
						})
						.catch((err) => {
							console.error('Ошибка отправки заказа:', err);
						});
				}
			});

			modal?.destroy();
			modal = new ModalView(
				contactsForm,
				() => {}, // onAddToCart
				() => {
					modal?.destroy();
					modal = null;
				}
			);
		} else {
			console.error('Шаблон #contacts не найден');
		}
	}
});

//  моадльное окно
events.on('preview:update', (product: ProductItem) => {
	//  если модалка открыта - закрыть
	if (modal) {
		modal.destroy();
		modal = null;
	}

	// клонирование шаблона
	const previewTemplate = document.querySelector<HTMLTemplateElement>('#card-preview');
	if (previewTemplate) {
		const card = previewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

		// данные
		card.querySelector('.card__image')?.setAttribute('src', product.image);
		card.querySelector('.card__image')?.setAttribute('alt', product.title);
		card.querySelector('.card__category')!.textContent = product.category || '';
		card.querySelector('.card__title')!.textContent = product.title;
		card.querySelector('.card__text')!.textContent = product.description;
		card.querySelector('.card__price')!.textContent = `${product.price} синапсов`;

		//  создание модалки с
		modal = new ModalView(
			card,
			() => {
				//  добавить в корзину
				cart.add(product);
				//  закрыть модалку
				modal?.destroy();
				modal = null;
			},
			() => {
				//  закрыть на крестик
				modal?.destroy();
				modal = null;
			}
		);
		modal?.show();
	}
});

console.log('API_ORIGIN:', process.env.API_ORIGIN);
