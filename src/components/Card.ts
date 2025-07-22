import { Product } from '../types/index';

export class Card {
	private element: HTMLElement;

	constructor(
		private product: Product,
		private onClick?: (product: Product) => void
	) {
		const template = document.getElementById(
			'card-catalog'
		) as HTMLTemplateElement;
		this.element = template.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;

		this.render();
		this.element.addEventListener('click', () => this.onClick?.(this.product));
	}

	private render() {
		this.element.querySelector('.card__title')!.textContent =
			this.product.title;
		this.element.querySelector(
			'.card__price'
		)!.textContent = `${this.product.price} синапсов`;

		const categoryEl = this.element.querySelector('.card__category')!;
		categoryEl.textContent = this.product.category;

		// цвета по категориям
		const categoryClassMap: Record<string, string> = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			'другое': 'other',
			дополнительное: 'additional',
			'кнопка': 'button',
		};

		const classSuffix = categoryClassMap[this.product.category] || 'other';
		categoryEl.classList.add(`card__category_${classSuffix}`);

		(this.element.querySelector('.card__image') as HTMLImageElement).src =
			this.product.image;
	}

	public getElement() {
		return this.element;
	}
}
