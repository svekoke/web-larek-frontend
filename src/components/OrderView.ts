import { OrderForm } from '../types/index';
import { FormView } from './base/FormView';

export class OrderView extends FormView<OrderForm> {
	private addressInput: HTMLInputElement;
	private paymentButtons: NodeListOf<HTMLButtonElement>;
	private errorContainer: HTMLElement;
	private selectedPayment: string = '';

	constructor(onSubmit: (data: OrderForm) => void) {
		super('order', onSubmit);

		this.addressInput = this.form.querySelector('input[name="address"]')!;
		this.paymentButtons = this.form.querySelectorAll('button[name]');
		this.errorContainer = this.form.querySelector('.form__errors')!;

		this.form.addEventListener('input', () => this.validate());

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.selectedPayment = button.name;

				this.paymentButtons.forEach(b =>
					b.classList.remove('button_alt-active')
				);
				button.classList.add('button_alt-active');

				this.validate();
			});
		});

		this.validate();
	}

	protected getData(): OrderForm {
		return {
			address: this.addressInput.value.trim(),
			payment: this.selectedPayment,
		};
	}

	protected validate() {
		const address = this.addressInput.value.trim();
		const isValid = address !== '' && this.selectedPayment !== '';

		this.submitButton.disabled = !isValid;

		this.errorContainer.textContent = !address ? 'Необходимо указать адрес' : '';
	}
}
