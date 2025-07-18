//  импорт типа заказа и событий
import { OrderData } from '../types/index';
import { IEvents } from './base/events';

//  класс формы
export class OrderView {
	protected element: HTMLFormElement;

	constructor(private events: IEvents) {

        //  шаблон из HTML находится
		const template = document.querySelector<HTMLTemplateElement>('#order');
		if (!template) throw new Error('Шаблон формы заказа не найден');

        //  клонирование шаблона форм
		this.element = template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;

		// отработчик клика 
		this.element.querySelectorAll('button[name]').forEach((btn) => {
			btn.addEventListener('click', () => {
				const type = btn.getAttribute('name')!;
				this.events.emit('order.payment', {value:type});
			});
		});

		// ввод адреса сохраняется значение из поля ввода
		this.element.address?.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			this.events.emit('order.address', { value: target.value });
		});

		//  отправка формы на "далее", отмена стандартной формы и отправляется событие
		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('order.submit');
		});
	}

    //  возвращает структуру чтоб вставить ее на страницу
	render(): HTMLElement {
		return this.element;
	}
}
