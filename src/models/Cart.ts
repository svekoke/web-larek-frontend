import { CartState, ProductItem } from '../types';
import { IEvents } from '../components/base/events';

//	хранит данные и логику корзины
export class Cart {
	private cart: CartState = { ids: [], sum: 0 };

	constructor(private events: IEvents) {}

	add(product: ProductItem) {
		this.cart.ids.push(product.id);
		this.cart.sum += product.price || 0;
		this.triggerUpdate();
	}

	remove(product: ProductItem) {
		this.cart.ids = this.cart.ids.filter(id => id !== product.id);
		this.cart.sum -= product.price || 0;
		this.triggerUpdate();
	}

	clear() {
		this.cart = { ids: [], sum: 0 };
		this.triggerUpdate();
	}

	contains(productId: string) {
		return this.cart.ids.includes(productId);
	}

	getState() {
		return this.cart;
	}

	private triggerUpdate() {
		this.events.emit('cart:update', this.cart);
	}
}
