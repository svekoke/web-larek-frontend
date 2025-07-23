export class Page {
	private gallery: HTMLElement;
	private basketCounter: HTMLElement;
	private basketButton: HTMLButtonElement;

	constructor() {
		this.gallery = document.querySelector('.gallery')!;
		this.basketCounter = document.querySelector('.header__basket-counter')!;
		this.basketButton = document.querySelector('.header__basket')!;
	}

	setBasketCount(count: number) {
		this.basketCounter.textContent = String(count);
	}

	setGallery(content: HTMLElement) {
		this.gallery.replaceChildren(content);
	}

	setBasketClickHandler(handler: () => void) {
		this.basketButton.addEventListener('click', handler);
	}
	addCard(card: HTMLElement) {
		this.gallery.append(card);
	}
}
