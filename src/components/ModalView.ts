// импорт типа товара
import { ProductItem } from '../types/index';

// класс модального окна
export class ModalView {
	private container: HTMLElement;

	// данные товара, функция добавления в корзину, клик на крестик
	constructor(
		private content: HTMLElement,
		private onPrimaryAction: () => void = () => {},
		private onClose: () => void
	) {
		// создаём и рендерим модалку
		this.container = this.render();
	}

	// создаёт и возвращает модалку
	private render(): HTMLElement {
		// обертка для окна
		const modal = document.createElement('div');
		modal.className = 'modal';

		// вставляем в разметку элемент HTML модалки
		modal.innerHTML = `
			<div class="modal__container">
				<button class="modal__close" aria-label="Закрыть"></button>
				<div class="modal__content"></div>
			</div>
		`;

		// добавляем контент в модалку
		modal.querySelector('.modal__content')?.appendChild(this.content);

		// обработчик закрытия модалки, вызывается функция
		const closeButton = modal.querySelector('.modal__close');
		closeButton?.addEventListener('click', () => {
			console.log('Кнопка закрытия нажата!');
			this.onClose(); // вызываем переданный onClose
		});

		// событие кнопки "в корзину"
		const primaryButton = modal.querySelector('.modal__content .card__button');
		primaryButton?.addEventListener('click', this.onPrimaryAction);

		// возвращаем модалку
		return modal;
	}

	// метод добавляющий модалку в body
	public show() {
		document.body.appendChild(this.container);
	}

	// метод удаляющий модалку со страницы
	public destroy() {
		this.container.style.display = 'none';
	}
}
