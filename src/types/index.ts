//	товар в каталоге
export interface ProductItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}


//	корзина
export interface CartState {
	ids: string[];
	sum: number;
}

//	способ оплаты
export type PaymentOptional = 'online' | 'inPerson' ;

//	заказ
export interface OrderData {
	contact: {
		email: string;
		phone: string;
	};
	address: string;
	paymentType: PaymentOptional;
	productIds: string[];
}

//	финал заказ оформлен
export interface OrderFinalized {
	orderId: string;
	totalSum: number;
	status?: 'success' | 'error';
}

//	апи при получении списка
export interface ApiListResponse<Type> {
	total: number;
	items: Type[];
}

