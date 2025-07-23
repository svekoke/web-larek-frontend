export class SuccessModal {
	private element: HTMLElement;
	private sumElement: HTMLElement;
	private closeButton: HTMLButtonElement;

	constructor(total: number, onClose: () => void) {
		const template = document.getElementById('success') as HTMLTemplateElement;
		this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		this.sumElement = this.element.querySelector('.order-success__description')!;
		this.sumElement.textContent = `Списано ${total} синапсов`;

		this.closeButton = this.element.querySelector('.order-success__close')!;
		this.closeButton.addEventListener('click', onClose);
	}

	getElement() {
		return this.element;
	}
}
