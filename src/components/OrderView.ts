import { OrderForm } from '../types/index';

export class OrderView {
  private element: HTMLElement;

  constructor(
    private onSubmit: (data: OrderForm) => void
  ) {
    const template = document.getElementById('order') as HTMLTemplateElement;
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const form = this.element as HTMLFormElement;
    const submitBtn = form.querySelector('.order__button') as HTMLButtonElement;
    const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
    const paymentButtons = form.querySelectorAll('button[name]');
    const errorContainer = form.querySelector('.form__errors') as HTMLSpanElement;

    let selectedPayment: string = '';

    const validate = () => {
      const address = addressInput.value.trim();
      const isValid = selectedPayment && address.length > 0;

      if (!address) {
        errorContainer.textContent = 'Необходимо указать адрес';
      } else {
        errorContainer.textContent = '';
      }

      submitBtn.disabled = !isValid;
    };

    form.addEventListener('input', validate);

    paymentButtons.forEach((btn) => {
      const button = btn as HTMLButtonElement;
      button.addEventListener('click', () => {
        selectedPayment = button.name;
        paymentButtons.forEach((b) => (b as HTMLElement).classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        validate();
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const address = addressInput.value.trim();
      if (!address || !selectedPayment) {
        validate();
        return;
      }

      this.onSubmit({
        address,
        payment: selectedPayment,
      });
    });
  }

  getElement() {
    return this.element;
  }
}
