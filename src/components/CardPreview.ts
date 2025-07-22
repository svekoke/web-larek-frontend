import { Product } from '../types/index';

export class CardPreview {
	private element: HTMLElement;

	constructor(
		private product: Product,
		private onAddToCart?: (product: Product) => void
	) {
		const template = document.getElementById(
			'card-preview'
		) as HTMLTemplateElement;
		this.element = template.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;
		this.render();

		const btn = this.element.querySelector('.card__button')!;
		btn.addEventListener('click', () => {
			this.onAddToCart?.(this.product);
		});
	}

	private render() {
		this.element.querySelector('.card__title')!.textContent =
			this.product.title;
		this.element.querySelector('.card__text')!.textContent =
			this.product.description;
		this.element.querySelector(
			'.card__price'
		)!.textContent = `${this.product.price} синапсов`;
		this.element.querySelector('.card__category')!.textContent =
			this.product.category;
		(this.element.querySelector('.card__image') as HTMLImageElement).src =
			this.product.image;
	}

	public getElement() {
		return this.element;
	}
}
