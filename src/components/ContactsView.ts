import { ContactForm } from '../types';
import { FormView } from './base/FormView';

export class ContactsView extends FormView<ContactForm> {
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;

	constructor(onSubmit: (data: ContactForm) => void) {
		super('contacts', onSubmit);

		this.emailInput = this.form.querySelector('input[name="email"]')!;
		this.phoneInput = this.form.querySelector('input[name="phone"]')!;

		this.form.addEventListener('input', () => this.validate());
		this.validate();
	}

	protected getData(): ContactForm {
		return {
			email: this.emailInput.value.trim(),
			phone: this.phoneInput.value.trim(),
		};
	}

	protected validate() {
		const valid =
			this.emailInput.value.trim() !== '' &&
			this.phoneInput.value.trim() !== '';
		this.submitButton.disabled = !valid;
	}
}
