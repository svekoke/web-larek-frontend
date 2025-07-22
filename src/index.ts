import './scss/styles.scss';

import { ProductApi } from './models/ProductApi';
import { ProductModel } from './models/ProductModel';
import { Card } from './components/Card';
import { CardPreview } from './components/CardPreview';
import { ModalView } from './components/ModalView';
import { Cart } from './models/Cart';
import { BasketView } from './components/BasketView';
import { Order } from './models/Order';
import { OrderView } from './components/OrderView';
import { ContactsView } from './components/ContactsView';
import { Product } from './types/index';

const API_URL = 'https://larek-api.nomoreparties.co/api/weblarek';
const CDN_URL = 'https://larek-api.nomoreparties.co/content/weblarek';

const gallery = document.querySelector('.gallery')!;
const basketButton = document.querySelector('.header__basket')!;
const basketCounter = document.querySelector(
	'.header__basket-counter'
) as HTMLElement;

const api = new ProductApi(API_URL);
const modal = new ModalView();
const cart = new Cart();
const order = new Order();

basketButton.addEventListener('click', () => renderBasket());

function updateBasketCounter() {
	basketCounter.textContent = String(cart.getTotalCount());
}

function showOrderStep() {
	const view = new OrderView((data) => {
		order.setForm(data);
		showContactsStep();
	});
	modal.open(view.getElement());
}

function renderBasket() {
	const view = new BasketView(
		cart.getItems(),
		(index) => {
			cart.remove(index);
			updateBasketCounter();
			renderBasket();
		},
		() => {
			order.setItems(cart.getItems()); //  сохраняем выбранные товары перед заказом
			showOrderStep();
		}
	);
	modal.open(view.getElement());
}

function showContactsStep() {
	const view = new ContactsView((data) => {
		order.setContacts(data);
		order.setItems(cart.getItems());

		const orderData = order.getOrderData(); // 👈 сохраняем ДО очистки
		console.log('Отправляем заказ:', orderData);

		api
			.post('/order', orderData)
			.then(() => {
				cart.clear();
				updateBasketCounter();
				order.clear();
				modal.open(renderSuccess(orderData.total)); // 👈 передаём сумму
			})
			.catch((err) => console.error('Ошибка заказа:', err));
	});

	modal.open(view.getElement());
}


function renderSuccess(total: number): HTMLElement {
	const template = document.getElementById('success') as HTMLTemplateElement;
	const el = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

	// Вставляем сумму
	const sumElement = el.querySelector('.order-success__description');
	if (sumElement) {
		sumElement.textContent = `Списано ${total} синапсов`;
	}

	el.querySelector('.order-success__close')?.addEventListener('click', () =>
		modal.close()
	);
	return el;
}


api.getProductList().then((products) => {
	products.forEach((item: Product) => {
		const model = new ProductModel({
			...item,
			image: `${CDN_URL}/${item.image}`,
		});

		const card = new Card(model.getData(), (product) => {
			const preview = new CardPreview(product, (toAdd) => {
				cart.add(toAdd);
				console.log('Товар добавлен в корзину:', cart.getItems()); // ← добавить

				updateBasketCounter();
				modal.close();
				renderBasket();
			});
			modal.open(preview.getElement());
		});

		gallery.append(card.getElement());
	});
});
