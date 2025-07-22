export class ModalView {
	private container: HTMLElement;
	private content: HTMLElement;

	constructor() {
		this.container = document.getElementById('modal-container')!;
		this.content = this.container.querySelector('.modal__content')!;
		this.container.querySelector('.modal__close')?.addEventListener('click', () => this.close());
	}

	open(html: HTMLElement) {
		this.content.innerHTML = '';
		this.content.append(html);
		this.container.classList.add('modal_active');
	}

	close() {
		this.container.classList.remove('modal_active');
	}
}
