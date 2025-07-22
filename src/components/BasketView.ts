import { Product } from '../types/index';

export class BasketView {
  private element: HTMLElement;

  constructor(
    private items: Product[],
    private onRemove: (index: number) => void,
    private onOrder: () => void
  ) {
    const template = document.getElementById('basket') as HTMLTemplateElement;
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const list = this.element.querySelector('.basket__list')!;
    const total = this.element.querySelector('.basket__price')!;
    const submitBtn = this.element.querySelector('.basket__button') as HTMLButtonElement;

    list.innerHTML = '';

    this.items.forEach((item, index) => {
      const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
      const card = itemTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

      card.querySelector('.basket__item-index')!.textContent = String(index + 1);
      card.querySelector('.card__title')!.textContent = item.title;
      card.querySelector('.card__price')!.textContent = `${item.price} синапсов`;

      const deleteBtn = card.querySelector('.basket__item-delete') as HTMLButtonElement;
      deleteBtn.addEventListener('click', () => this.onRemove(index));

      list.append(card);
    });

    const totalPrice = this.items.reduce((sum, item) => sum + item.price, 0);
    total.textContent = `${totalPrice} синапсов`;

    submitBtn.disabled = this.items.length === 0;

    submitBtn.addEventListener('click', () => {
      this.onOrder();
    });
  }

  getElement() {
    return this.element;
  }
}
