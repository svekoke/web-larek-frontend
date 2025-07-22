import { OrderForm, ContactForm, Product } from '../types/index';

export class Order {
  private items: Product[] = [];
  private form: Partial<OrderForm> = {};
  private contacts: Partial<ContactForm> = {};

  setItems(items: Product[]) {
    this.items = items;
  }

  setForm(data: OrderForm) {
    this.form = data;
  }

  setContacts(data: ContactForm) {
    this.contacts = data;
  }

  getOrderData() {
    return {
      items: this.items.map((item) => item.id),
      total: this.items.reduce((sum, item) => sum + item.price, 0), // сумма заказа
      ...this.form,
      ...this.contacts,
    };
  }

  clear() {
    this.items = [];
    this.form = {};
    this.contacts = {};
  }
}
