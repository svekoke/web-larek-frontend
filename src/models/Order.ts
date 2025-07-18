import { OrderData, OrderFinalized, PaymentOptional } from '../types';
import { IEvents } from '../components/base/events';

//	хранит данные и логику заказа
export class Order {
	private order: OrderData = {
		contact: { email: '', phone: '' },
		address: '',
		paymentType: 'online',
		productIds: [],
	};

	private errors: Partial<
		Record<keyof OrderData | 'contact.email' | 'contact.phone', string>
	> = {};

	constructor(private events: IEvents) {}

	setField(
		field: keyof OrderData | 'contact.email' | 'contact.phone',
		value: string
	) {
		if (field === 'contact.email') this.order.contact.email = value;
		else if (field === 'contact.phone') this.order.contact.phone = value;
		else this.order[field as keyof OrderData] = value as any;

		this.events.emit('order:update', this.order);
	}

	attachProducts(ids: string[], total: number) {
		this.order.productIds = ids;
	}

	validate(): boolean {
		const errors: typeof this.errors = {};

		if (!this.order.contact.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			errors['contact.email'] = 'Некорректный email';
		}

		if (!this.order.contact.phone) {
			errors['contact.phone'] = 'Укажите телефон';
		}

		if (!this.order.address) {
			errors.address = 'Введите адрес доставки';
		}

		this.errors = errors;
		this.events.emit('order:errors', this.errors);
		return Object.keys(errors).length === 0;
	}

	getOrder(): OrderData {
		return this.order;
	}

	getErrors() {
		return this.errors;
	}
}
