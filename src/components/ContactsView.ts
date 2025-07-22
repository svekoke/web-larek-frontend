import { ContactForm } from '../types';


export class ContactsView {
  private element: HTMLElement;

  constructor(
    private onSubmit: (data: { email: string; phone: string }) => void
  ) {
    const template = document.getElementById('contacts') as HTMLTemplateElement;
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const form = this.element as HTMLFormElement;
    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;;
    const phoneInput = form.querySelector('input[name="phone"]')! as HTMLInputElement;;
    const submitBtn = form.querySelector('button[type="submit"]')! as HTMLInputElement;;

    form.addEventListener('input', () => {
      const valid =
        emailInput.value.trim().length > 0 &&
        phoneInput.value.trim().length > 0;
      submitBtn.toggleAttribute('disabled', !valid);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit({
        email: emailInput.value,
        phone: phoneInput.value,
      });
    });
  }

  getElement() {
    return this.element;
  }
}
