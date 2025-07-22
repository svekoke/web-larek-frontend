// Тип товара
export type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
};

// Тип ответа от API со списком
export type ApiListResponse<T> = {
  total: number;
  items: T[];
};

// Тип формы заказа (1-й шаг)
export type OrderForm = {
  payment: string;   // "card" или "cash"
  address: string;
};

// Тип формы контактов (2-й шаг)
export type ContactForm = {
  email: string;
  phone: string;
};

// Полный заказ (то, что отправляется на сервер)
export type OrderRequest = {
  items: string[]; // массив id товаров
} & OrderForm & ContactForm;
