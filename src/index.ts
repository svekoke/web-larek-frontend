import './scss/styles.scss';

import { ProductApi } from './components/base/ProductApi';
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
import { Page } from './components/Page';
import { SuccessModal } from './components/SuccessModal';

const API_URL = 'https://larek-api.nomoreparties.co/api/weblarek';
const CDN_URL = 'https://larek-api.nomoreparties.co/content/weblarek';

const page = new Page();
const api = new ProductApi(API_URL);
const modal = new ModalView();
const cart = new Cart();
const order = new Order();

page.setBasketClickHandler(() => renderBasket());

function updateBasketCounter() {
	page.setBasketCount(cart.getTotalCount());
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

		// фильтр товаров по цене > 0
		const validItems = cart.getItems().filter((item) => item.price > 0);
		order.setItems(validItems);

		const orderData = order.getOrderData(); //  сохраняем до очистки

		api
			.post('/order', orderData)
			.then(() => {
				cart.clear();
				updateBasketCounter();
				order.clear();
				const successModal = new SuccessModal(orderData.total, () =>
					modal.close()
				);
				modal.open(successModal.getElement()); //  передаём сумму
			})
			.catch((err) => console.error('Ошибка заказа:', err));
	});

	modal.open(view.getElement());
}

api
	.getProductList()
	.then((products) => {
		products.forEach((item: Product) => {
			const model = new ProductModel({
				...item,
				image: `${CDN_URL}/${item.image}`,
			});

			const card = new Card(model.getData(), (product) => {
				const preview = new CardPreview(product, (toAdd) => {
					cart.add(toAdd);
					console.log('Товар добавлен в корзину:', cart.getItems());

					updateBasketCounter();
					modal.close();
					renderBasket();
				});

				modal.open(preview.getElement());
			});

			page.addCard(card.getElement());
		});
	})
	.catch((error) => {
		console.error('Ошибка при загрузке товаров с сервера:', error);
	});
