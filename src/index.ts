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
			showOrderStep();
		}
	);
	modal.open(view.getElement());
}

function showContactsStep() {
	const view = new ContactsView((data) => {
		order.setContacts(data);

		// фильтруем товары по цене > 0
		const validItems = cart.getItems().filter((item) => item.price > 0);
		order.setItems(validItems);

		const orderData = order.getOrderData(); //  то что нужно серверу
		const total = validItems.reduce((sum, item) => sum + item.price, 0); // отдельно считается сумма

		api
			.post('/order', orderData)
			.then(() => {
				cart.clear();
				updateBasketCounter();
				order.clear();

				const successModal = new SuccessModal(total, () => modal.close());
				modal.open(successModal.getElement());
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
				//	игнорировать товары без цены
				if (!product.price) return;
				const preview = new CardPreview(product, (toAdd) => {
					const isAlreadyInCart = cart
						.getItems()
						.some((item) => item.id === toAdd.id);
					if (!isAlreadyInCart) {
						cart.add(toAdd);
						console.log('Товар добавлен в корзину:', cart.getItems());
						updateBasketCounter();
						renderBasket();
					}
					modal.close();
				});

				modal.open(preview.getElement());
			});

			page.addCard(card.getElement());
		});
	})
	.catch((error) => {
		console.error('Ошибка при загрузке товаров с сервера:', error);
	});
