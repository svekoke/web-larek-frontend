import { Product } from '../types/index';

export class Cart {
	private items: Product[] = [];

	add(product: Product) {
		this.items.push(product);
	}

	remove(index: number) {
		this.items.splice(index, 1);
	}

	getItems(): Product[] {
		return this.items;
	}

	getTotal(): number {
		return this.items.reduce((sum, item) => sum + item.price, 0);
	}

	clear() {
		this.items = [];
	}
	getTotalCount(): number {
		return this.items.length;
	}
}
