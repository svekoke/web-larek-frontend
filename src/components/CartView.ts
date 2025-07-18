//  импорт корзины (айди сумма)
import { CartState } from '../types/index';

//  класс визуальная часть корзины
export class CartView {
	private counter: HTMLElement;

	//  принимает css, ищет элемент на странице и сохраняет
	constructor(containerSelector: string) {
		const counter = document.querySelector(containerSelector);
		if (!counter) {
			throw new Error('Корзина не найдена в DOM');
		}
		this.counter = counter as HTMLElement;
	}

	//  получает текущую корзину, кол-во товара, вставляет в HTML
	render(state: CartState) {
		this.counter.textContent = String(state.ids.length);
	}
}
